import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Questionnaire } from "@/models/Questionnaire";
import nodemailer from "nodemailer";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    // Create a new submission from the received data
    const newSubmission = await Questionnaire.create(data);

    // Send email notification
    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      });

      const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
      
      const emailContent = Object.entries(data)
        .map(([key, value]) => `<strong>${key}:</strong> ${Array.isArray(value) ? value.join(", ") : value}`)
        .join("<br>");

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: adminEmail,
        subject: `New Questionnaire Submission from ${data.name || "Unknown"}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">New Questionnaire Submission</h1>
            </div>
            <div style="padding: 20px; background-color: #f9f9f9;">
              <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
                <h3 style="color: #333; margin-top: 0; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Submission Details</h3>
                ${emailContent}
              </div>
            </div>
            <div style="text-align: center; padding: 20px; background-color: #f1f1f1; border-radius: 0 0 10px 10px;">
              <p style="margin: 0; color: #666; font-size: 14px;">Received on: ${new Date().toLocaleString()}</p>
            </div>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error("Failed to send questionnaire email:", emailError);
      // We still return success for the DB entry even if email fails
    }

    return NextResponse.json(
      {
        success: true,
        message: "Questionnaire submitted successfully",
        id: newSubmission._id,
      },
      { status: 201, headers: corsHeaders }
    );
  } catch (error: any) {
    console.error("Questionnaire submission error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to submit questionnaire",
        error: error.message,
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const submissions = await Questionnaire.find().sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        data: submissions,
      },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    console.error("List questionnaire error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch submissions",
        error: error.message,
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
