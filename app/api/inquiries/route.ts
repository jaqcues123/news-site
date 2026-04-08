import { NextRequest, NextResponse } from "next/server";
import { InquiryFormData } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body: InquiryFormData = await req.json();

    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    // Try to send via Resend if configured
    const apiKey = process.env.RESEND_API_KEY;
    const salesEmail = process.env.SALES_EMAIL ?? "sales@netruckcenter.com";
    const fromEmail = process.env.FROM_EMAIL ?? "noreply@netruckcenter.com";

    if (apiKey) {
      const { Resend } = await import("resend");
      const resend = new Resend(apiKey);

      await resend.emails.send({
        from: fromEmail,
        to: salesEmail,
        subject: `New Inquiry: ${body.truck_title || "General"}`,
        html: buildEmailHtml(body),
      });
    } else {
      // Development fallback — log to console
      console.log("📬 New inquiry received:", body);
      console.log("(Set RESEND_API_KEY to send real emails)");
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("POST /api/inquiries:", err);
    return NextResponse.json(
      { error: "Failed to submit inquiry. Please try again." },
      { status: 500 }
    );
  }
}

function buildEmailHtml(data: InquiryFormData): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #111111; padding: 24px; border-radius: 8px 8px 0 0;">
        <h1 style="color: #FFFFFF; margin: 0; font-size: 20px;">
          New Sales Inquiry — New England Wrecker Sales
        </h1>
      </div>
      <div style="background: #F5F5F5; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #E0E0E0;">
        ${data.truck_title ? `
          <div style="background: #FFC700; color: #111111; padding: 8px 16px; border-radius: 4px; margin-bottom: 20px; display: inline-block;">
            Truck: ${data.truck_title}
          </div>
        ` : ""}
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #666; width: 100px;">Name</td>
            <td style="padding: 8px 0; font-weight: bold;">${data.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666;">Email</td>
            <td style="padding: 8px 0;">
              <a href="mailto:${data.email}" style="color: #3A6EA5;">${data.email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666;">Phone</td>
            <td style="padding: 8px 0;">${data.phone || "Not provided"}</td>
          </tr>
        </table>
        <hr style="border: none; border-top: 1px solid #E0E0E0; margin: 16px 0;" />
        <p style="color: #666; margin: 0 0 8px;">Message:</p>
        <p style="margin: 0; white-space: pre-wrap;">${data.message}</p>
      </div>
    </div>
  `;
}
