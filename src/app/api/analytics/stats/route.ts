import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { VisitorSession, PageView, Event } from "@/models/Analytics";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "7d"; // 7d, 30d, 90d, 1y
    const page = searchParams.get("page");

    // Calculate date range
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case "1d":
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "90d":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case "1y":
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const dateFilter = { firstVisit: { $gte: startDate } };
    const pageViewFilter = { timestamp: { $gte: startDate } };

    // Basic stats
    const [
      totalVisitors,
      totalSessions,
      totalPageViews,
      uniqueVisitors,
      returningVisitors,
    ] = await Promise.all([
      VisitorSession.countDocuments(dateFilter),
      VisitorSession.countDocuments({ lastActivity: { $gte: startDate } }),
      PageView.countDocuments(pageViewFilter),
      VisitorSession.distinct("visitorId", dateFilter).then(
        (ids) => ids.length
      ),
      VisitorSession.countDocuments({
        ...dateFilter,
        isReturningVisitor: true,
      }),
    ]);

    // Top pages
    const topPages = await PageView.aggregate([
      { $match: pageViewFilter },
      {
        $group: {
          _id: "$page",
          views: { $sum: 1 },
          uniqueVisitors: { $addToSet: "$visitorId" },
        },
      },
      {
        $project: {
          page: "$_id",
          views: 1,
          uniqueVisitors: { $size: "$uniqueVisitors" },
        },
      },
      { $sort: { views: -1 } },
      { $limit: 10 },
    ]);

    // Device types
    const deviceTypes = await VisitorSession.aggregate([
      { $match: dateFilter },
      { $group: { _id: "$device.type", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Browsers
    const browsers = await VisitorSession.aggregate([
      { $match: dateFilter },
      { $group: { _id: "$device.browser", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Operating systems
    const operatingSystems = await VisitorSession.aggregate([
      { $match: dateFilter },
      { $group: { _id: "$device.os", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Countries
    const countries = await VisitorSession.aggregate([
      { $match: dateFilter },
      { $group: { _id: "$location.country", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Daily visitors (for charts)
    const dailyVisitors = await VisitorSession.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$firstVisit" } },
          visitors: { $sum: 1 },
          uniqueVisitors: { $addToSet: "$visitorId" },
        },
      },
      {
        $project: {
          date: "$_id",
          visitors: 1,
          uniqueVisitors: { $size: "$uniqueVisitors" },
        },
      },
      { $sort: { date: 1 } },
    ]);

    // Events
    const topEvents = await Event.aggregate([
      { $match: { timestamp: { $gte: startDate } } },
      {
        $group: {
          _id: { category: "$eventCategory", action: "$eventAction" },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Average session duration
    const avgSessionDuration = await VisitorSession.aggregate([
      { $match: { ...dateFilter, totalDuration: { $gt: 0 } } },
      { $group: { _id: null, avgDuration: { $avg: "$totalDuration" } } },
    ]);

    // Bounce rate (sessions with only 1 page view)
    const bounceRate = await VisitorSession.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          totalSessions: { $sum: 1 },
          bouncedSessions: {
            $sum: { $cond: [{ $eq: ["$pageViews", 1] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          bounceRate: {
            $multiply: [
              { $divide: ["$bouncedSessions", "$totalSessions"] },
              100,
            ],
          },
        },
      },
    ]);

    const stats = {
      overview: {
        totalVisitors,
        totalSessions,
        totalPageViews,
        uniqueVisitors,
        returningVisitors,
        newVisitors: totalVisitors - returningVisitors,
        avgSessionDuration: avgSessionDuration[0]?.avgDuration || 0,
        bounceRate: bounceRate[0]?.bounceRate || 0,
      },
      topPages,
      deviceTypes,
      browsers,
      operatingSystems,
      countries,
      dailyVisitors,
      topEvents,
      period,
      dateRange: {
        start: startDate,
        end: now,
      },
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Analytics stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics stats" },
      { status: 500 }
    );
  }
}
