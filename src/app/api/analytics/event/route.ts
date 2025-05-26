import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Event, VisitorSession } from "@/models/Analytics";

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
    const {
      sessionId,
      visitorId,
      eventType,
      eventCategory,
      eventAction,
      eventLabel,
      eventValue,
      page,
      metadata,
    } = body;

    if (
      !sessionId ||
      !visitorId ||
      !eventType ||
      !eventCategory ||
      !eventAction
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Record event
    const event = new Event({
      sessionId,
      visitorId,
      eventType,
      eventCategory,
      eventAction,
      eventLabel,
      eventValue,
      page,
      metadata,
    });

    await event.save();

    // Update session last activity
    await VisitorSession.findOneAndUpdate(
      { sessionId },
      { $set: { lastActivity: new Date() } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics event error:", error);
    return NextResponse.json(
      { error: "Failed to record event" },
      { status: 500 }
    );
  }
}
