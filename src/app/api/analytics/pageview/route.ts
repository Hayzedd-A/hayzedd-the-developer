import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { PageView, VisitorSession } from "@/models/Analytics";

export async function POST(request: NextRequest) {
  try {
    if (request.method !== "POST")
      return NextResponse.json(
        {
          error: "Invalid Route",
        },
        { status: 404 }
      );
    await connectDB();

    const body = await request.json();
    const { sessionId, visitorId, page, title, referrer, duration } = body;

    if (!sessionId || !visitorId || !page) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Record page view
    const pageView = new PageView({
      sessionId,
      visitorId,
      page,
      title,
      referrer,
      duration,
    });

    await pageView.save();

    // Update session stats
    await VisitorSession.findOneAndUpdate(
      { sessionId },
      {
        $inc: {
          pageViews: 1,
          totalDuration: duration || 0,
        },
        $set: { lastActivity: new Date() },
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics pageview error:", error);
    return NextResponse.json(
      { error: "Failed to record page view" },
      { status: 500 }
    );
  }
}
