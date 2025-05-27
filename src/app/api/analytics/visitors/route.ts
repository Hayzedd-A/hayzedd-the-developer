import { NextRequest, NextResponse } from "next/server";
import connectDB  from "@/lib/mongodb";
import { VisitorSession, Event } from "@/models/Analytics";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    // Query parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const sortBy = searchParams.get("sortBy") || "lastActivity"; // lastActivity, firstVisit, pageViews, totalDuration
    const sortOrder = searchParams.get("sortOrder") || "desc"; // asc, desc
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const country = searchParams.get("country");
    const device = searchParams.get("device");
    const isReturning = searchParams.get("isReturning");

    // Build filter object
    const filter: any = {};

    // Date range filter
    if (dateFrom || dateTo) {
      filter.firstVisit = {};
      if (dateFrom) filter.firstVisit.$gte = new Date(dateFrom);
      if (dateTo) filter.firstVisit.$lte = new Date(dateTo);
    }

    // Additional filters
    if (country)
      filter["location.country"] = { $regex: country, $options: "i" };
    if (device) filter["device.type"] = { $regex: device, $options: "i" };
    if (isReturning !== null && isReturning !== undefined) {
      filter.isReturningVisitor = isReturning === "true";
    }

    // Build sort object
    const sortObj: any = {};
    sortObj[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Get visitors with pagination and sorting
    const visitors = await VisitorSession.find(filter)
      .select({
        visitorId: 1,
        sessionId: 1,
        "location.country": 1,
        "location.city": 1,
        "device.type": 1,
        "device.browser": 1,
        "device.os": 1,
        "device.isMobile": 1,
        firstVisit: 1,
        lastActivity: 1,
        pageViews: 1,
        totalDuration: 1,
        isReturningVisitor: 1,
        source: 1,
        medium: 1,
        bounced: 1,
      })
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalCount = await VisitorSession.countDocuments(filter);

    // If sorting by interaction, we need to aggregate events data
    if (sortBy === "interactions") {
      const visitorIds = visitors.map((v) => v.visitorId);

      // Get interaction counts for each visitor
      const interactionCounts = await Event.aggregate([
        { $match: { visitorId: { $in: visitorIds } } },
        {
          $group: {
            _id: "$visitorId",
            totalInteractions: { $sum: 1 },
            lastInteraction: { $max: "$timestamp" },
          },
        },
      ]);

      // Create a map for quick lookup
      const interactionMap = new Map(
        interactionCounts.map((item) => [item._id, item])
      );

      // Add interaction data to visitors
      const visitorsWithInteractions = visitors.map((visitor) => ({
        ...visitor,
        totalInteractions:
          interactionMap.get(visitor.visitorId)?.totalInteractions || 0,
        lastInteraction:
          interactionMap.get(visitor.visitorId)?.lastInteraction || null,
      }));

      // Sort by interactions if requested
      if (sortBy === "interactions") {
        visitorsWithInteractions.sort((a, b) => {
          const order = sortOrder === "asc" ? 1 : -1;
          return (a.totalInteractions - b.totalInteractions) * order;
        });
      }

      return NextResponse.json({
        success: true,
        data: {
          visitors: visitorsWithInteractions,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            totalCount,
            hasNext: page * limit < totalCount,
            hasPrev: page > 1,
          },
          filters: {
            sortBy,
            sortOrder,
            dateFrom,
            dateTo,
            country,
            device,
            isReturning,
          },
        },
      });
    }

    // Format response data
    const formattedVisitors = visitors.map((visitor) => ({
      id: visitor._id,
      visitorId: visitor.visitorId,
      sessionId: visitor.sessionId,
      location: {
        country: visitor.location?.country || "Unknown",
        city: visitor.location?.city || "Unknown",
      },
      device: {
        type: visitor.device?.type || "Unknown",
        browser: visitor.device?.browser || "Unknown",
        os: visitor.device?.os || "Unknown",
        isMobile: visitor.device?.isMobile || false,
      },
      firstVisit: visitor.firstVisit,
      lastActivity: visitor.lastActivity,
      pageViews: visitor.pageViews || 0,
      totalDuration: visitor.totalDuration || 0,
      isReturningVisitor: visitor.isReturningVisitor || false,
      source: visitor.source || "Direct",
      medium: visitor.medium || "None",
      bounced: visitor.bounced || false,
      // Calculate session duration in minutes
      sessionDuration: visitor.totalDuration
        ? Math.round(visitor.totalDuration / 60000)
        : 0,
    }));

    return NextResponse.json({
      success: true,
      data: {
        visitors: formattedVisitors,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
          hasNext: page * limit < totalCount,
          hasPrev: page > 1,
        },
        filters: {
          sortBy,
          sortOrder,
          dateFrom,
          dateTo,
          country,
          device,
          isReturning,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching visitors:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch visitors",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
