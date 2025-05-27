import { NextRequest, NextResponse } from "next/server";
import {
  PageView,
  VisitorSession,
  Event,
  FormSubmission,
  ErrorEvent,
  PerformanceMetric,
} from "@/models/Analytics";
import connectDB from "@/lib/mongodb";

export async function GET(
  request: NextRequest,
  context : { params: { visitorId: string } }
) {
  try {
    await connectDB();

    const { visitorId } = context.params;
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Build date filter
    const dateFilter: any = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const filter: any = { visitorId };
    if (Object.keys(dateFilter).length > 0) {
      filter.timestamp = dateFilter;
    }

    // Get visitor sessions
    const sessions = await VisitorSession.find({ visitorId })
      .sort({ firstVisit: -1 })
      .lean();

    // Get page views
    const pageViews = await PageView.find(filter)
      .sort({ timestamp: -1 })
      .lean();

    // Get events
    const events = await Event.find(filter).sort({ timestamp: -1 }).lean();

    // Get form submissions
    const formSubmissions = await FormSubmission.find(filter)
      .sort({ timestamp: -1 })
      .lean();

    // Get errors
    const errors = await ErrorEvent.find(filter).sort({ timestamp: -1 }).lean();

    // Get performance metrics
    const performanceMetrics = await PerformanceMetric.find(filter)
      .sort({ timestamp: -1 })
      .lean();

    // Calculate visitor statistics
    const stats = {
      totalSessions: sessions.length,
      totalPageViews: pageViews.length,
      totalEvents: events.length,
      totalFormSubmissions: formSubmissions.length,
      totalErrors: errors.length,
      totalDuration: sessions.reduce(
        (sum, session) => sum + (session.totalDuration || 0),
        0
      ),
      averageSessionDuration:
        sessions.length > 0
          ? sessions.reduce(
              (sum, session) => sum + (session.totalDuration || 0),
              0
            ) / sessions.length
          : 0,
      bounceRate:
        sessions.length > 0
          ? (sessions.filter((s) => s.bounced).length / sessions.length) * 100
          : 0,
      firstVisit:
        sessions.length > 0 ? sessions[sessions.length - 1].firstVisit : null,
      lastVisit: sessions.length > 0 ? sessions[0].lastActivity : null,
      isReturningVisitor: sessions.some((s) => s.isReturningVisitor),
      countries: [
        ...new Set(sessions.map((s) => s.location?.country).filter(Boolean)),
      ],
      devices: [...new Set(sessions.map((s) => s.device.type).filter(Boolean))],
      browsers: [
        ...new Set(sessions.map((s) => s.device.browser).filter(Boolean)),
      ],
      operatingSystems: [
        ...new Set(sessions.map((s) => s.device.os).filter(Boolean)),
      ],
      sources: [...new Set(sessions.map((s) => s.source).filter(Boolean))],
      campaigns: [...new Set(sessions.map((s) => s.campaign).filter(Boolean))],
    };

    // Calculate page statistics
    const pageStats = pageViews.reduce((acc, pv) => {
      const page = pv.page;
      if (!acc[page]) {
        acc[page] = {
          page,
          views: 0,
          totalDuration: 0,
          averageDuration: 0,
          maxScrollDepth: 0,
          bounces: 0,
        };
      }
      acc[page].views++;
      acc[page].totalDuration += pv.duration || 0;
      acc[page].maxScrollDepth = Math.max(
        acc[page].maxScrollDepth,
        pv.scrollDepth || 0
      );
      if ((pv.duration || 0) < 30000) {
        // Less than 30 seconds considered bounce
        acc[page].bounces++;
      }
      return acc;
    }, {} as Record<string, any>);

    // Calculate average durations
    Object.values(pageStats).forEach((stat: any) => {
      stat.averageDuration =
        stat.views > 0 ? stat.totalDuration / stat.views : 0;
      stat.bounceRate = stat.views > 0 ? (stat.bounces / stat.views) * 100 : 0;
    });

    // Calculate event statistics
    const eventStats = events.reduce((acc, event) => {
      const key = `${event.eventCategory}_${event.eventAction}`;
      if (!acc[key]) {
        acc[key] = {
          category: event.eventCategory,
          action: event.eventAction,
          count: 0,
          labels: new Set(),
          totalValue: 0,
        };
      }
      acc[key].count++;
      if (event.eventLabel) acc[key].labels.add(event.eventLabel);
      acc[key].totalValue += event.eventValue || 0;
      return acc;
    }, {} as Record<string, any>);

    // Convert sets to arrays
    Object.values(eventStats).forEach((stat: any) => {
      stat.labels = Array.from(stat.labels);
    });

    // Calculate performance statistics
    const performanceStats = performanceMetrics.reduce((acc, metric) => {
      const key = metric.metricName;
      if (!acc[key]) {
        acc[key] = {
          metricName: key,
          metricType: metric.metricType,
          count: 0,
          totalValue: 0,
          averageValue: 0,
          minValue: Infinity,
          maxValue: -Infinity,
          values: [],
        };
      }
      acc[key].count++;
      acc[key].totalValue += metric.value;
      acc[key].minValue = Math.min(acc[key].minValue, metric.value);
      acc[key].maxValue = Math.max(acc[key].maxValue, metric.value);
      acc[key].values.push({
        value: metric.value,
        timestamp: metric.timestamp,
        page: metric.page,
      });
      return acc;
    }, {} as Record<string, any>);

    // Calculate averages
    Object.values(performanceStats).forEach((stat: any) => {
      stat.averageValue = stat.count > 0 ? stat.totalValue / stat.count : 0;
      stat.values.sort(
        (a: any, b: any) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    });

    return NextResponse.json({
      visitorId,
      stats,
      sessions,
      pageViews,
      events,
      formSubmissions,
      errors,
      performanceMetrics,
      analytics: {
        pageStats: Object.values(pageStats),
        eventStats: Object.values(eventStats),
        performanceStats: Object.values(performanceStats),
      },
    });
  } catch (error) {
    console.error("Error fetching visitor details:", error);
    return NextResponse.json(
      { error: "Failed to fetch visitor details" },
      { status: 500 }
    );
  }
}
