import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Questionnaire } from "@/models/Questionnaire";

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    // Create a new submission from the received data
    const newSubmission = await Questionnaire.create(data);

    return NextResponse.json(
      {
        success: true,
        message: "Questionnaire submitted successfully",
        id: newSubmission._id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Questionnaire submission error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to submit questionnaire",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const submissions = await Questionnaire.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: submissions,
    });
  } catch (error: any) {
    console.error("List questionnaire error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch submissions",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
