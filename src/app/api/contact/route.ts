import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Create transporter

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for port 465, false for other ports
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    // Alternative configuration for other email services
    // const transporter = nodemailer.createTransporter({
    //   host: process.env.SMTP_HOST,
    //   port: parseInt(process.env.SMTP_PORT || '587'),
    //   secure: false, // true for 465, false for other ports
    //   auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASS,
    //   },
    // });

    // Email to you (notification)
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">New Contact Form Submission</h1>
          </div>
          
          <div style="padding: 20px; background-color: #f9f9f9;">
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
              <h3 style="color: #333; margin-top: 0; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Contact Details</h3>
              <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
              <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #667eea;">${email}</a></p>
              <p style="margin: 10px 0;"><strong>Subject:</strong> ${subject}</p>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px;">
              <h3 style="color: #333; margin-top: 0; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Message</h3>
              <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #667eea;">
                <p style="margin: 0; line-height: 1.6; color: #555;">${message.replace(
                  /\n/g,
                  "<br>"
                )}</p>
              </div>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px; background-color: #f1f1f1; border-radius: 0 0 10px 10px;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              This email was sent from your portfolio contact form.
            </p>
            <p style="margin: 5px 0 0 0; color: #666; font-size: 12px;">
              Received on: ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
      `,
    };

    // Auto-reply email to the sender
    const autoReplyOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Thank you for contacting me, ${name}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Thank You for Reaching Out!</h1>
          </div>
          
          <div style="padding: 30px; background-color: #f9f9f9;">
            <div style="background: white; padding: 25px; border-radius: 8px;">
              <h2 style="color: #333; margin-top: 0;">Hi ${name},</h2>
              
              <p style="color: #555; line-height: 1.6; margin: 15px 0;">
                Thank you for getting in touch! I've received your message about "<strong>${subject}</strong>" and I'm excited to learn more about your project.
              </p>
              
              <p style="color: #555; line-height: 1.6; margin: 15px 0;">
                I typically respond to all inquiries within 24-48 hours. In the meantime, feel free to check out my latest work on my portfolio or connect with me on social media.
              </p>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0;">
                <h3 style="color: #333; margin-top: 0;">What happens next?</h3>
                <ul style="color: #555; line-height: 1.6; margin: 0; padding-left: 20px;">
                  <li>I'll review your message and project requirements</li>
                  <li>I'll respond with any clarifying questions</li>
                  <li>We can schedule a call to discuss your project in detail</li>
                  <li>I'll provide a detailed proposal and timeline</li>
                </ul>
              </div>
              
              <p style="color: #555; line-height: 1.6; margin: 15px 0;">
                Looking forward to potentially working together!
              </p>
              
              <p style="color: #555; line-height: 1.6; margin: 15px 0;">
                Best regards,<br>
                <strong>Hayzedd</strong><br>
                Full Stack Developer
              </p>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px; background-color: #f1f1f1; border-radius: 0 0 10px 10px;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              This is an automated response. Please don't reply to this email.
            </p>
            <p style="margin: 5px 0 0 0; color: #666; font-size: 12px;">
              If you need immediate assistance, please call or send another message.
            </p>
          </div>
        </div>
      `,
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(autoReplyOptions),
    ]);

    return NextResponse.json(
      {
        message: "Email sent successfully!",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      {
        error: "Failed to send email. Please try again later.",
        success: false,
      },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
