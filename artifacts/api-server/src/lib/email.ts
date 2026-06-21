import { Resend } from "resend";
import { logger } from "./logger";

const NOTIFY_EMAIL = "kcharanreddy07@gmail.com";
const FROM_EMAIL = "SCAVA <onboarding@resend.dev>";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    logger.warn("RESEND_API_KEY not set — email notifications disabled");
    return null;
  }
  return new Resend(key);
}

export async function sendBookingNotification(booking: {
  name: string;
  email: string;
  phone: string;
  date: string;
  timeSlot: string;
  players: number;
  notes?: string | null;
}) {
  const resend = getResend();
  if (!resend) return;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: NOTIFY_EMAIL,
      subject: `New Court Booking — ${booking.name} on ${booking.date}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f5f2ee;">
          <div style="background: #1a1a1a; padding: 24px; margin-bottom: 24px;">
            <h1 style="color: #f5f2ee; margin: 0; font-size: 24px; letter-spacing: 2px;">SCAVA</h1>
            <p style="color: #cc1f1f; margin: 4px 0 0; font-size: 12px; letter-spacing: 3px; text-transform: uppercase;">New Court Booking</p>
          </div>
          <div style="background: #fff; padding: 24px; border-left: 4px solid #cc1f1f;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; width: 40%;">Name</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">${booking.name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Phone</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">${booking.phone}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Email</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${booking.email}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Date</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #cc1f1f;">${booking.date}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Time Slot</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #cc1f1f;">${booking.timeSlot}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Players</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${booking.players}</td>
              </tr>
              ${booking.notes ? `
              <tr>
                <td style="padding: 10px 0; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Notes</td>
                <td style="padding: 10px 0;">${booking.notes}</td>
              </tr>` : ""}
            </table>
          </div>
          <p style="color: #999; font-size: 11px; margin-top: 24px; text-align: center; letter-spacing: 1px;">SCAVA // BREW & PLAY // EST 2026 // NELLORE</p>
        </div>
      `,
    });
    logger.info("Booking notification email sent");
  } catch (err) {
    logger.error({ err }, "Failed to send booking notification email");
  }
}

export async function sendContactNotification(inquiry: {
  name: string;
  email: string;
  phone: string;
  inquiryType: string;
  message: string;
}) {
  const resend = getResend();
  if (!resend) return;

  const typeLabels: Record<string, string> = {
    private: "Private Event",
    corporate: "Corporate Booking",
    tournament: "Tournament Hosting",
    general: "General Question",
  };

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: NOTIFY_EMAIL,
      subject: `New Inquiry — ${typeLabels[inquiry.inquiryType] ?? inquiry.inquiryType} from ${inquiry.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f5f2ee;">
          <div style="background: #1a1a1a; padding: 24px; margin-bottom: 24px;">
            <h1 style="color: #f5f2ee; margin: 0; font-size: 24px; letter-spacing: 2px;">SCAVA</h1>
            <p style="color: #cc1f1f; margin: 4px 0 0; font-size: 12px; letter-spacing: 3px; text-transform: uppercase;">New Contact Inquiry</p>
          </div>
          <div style="background: #fff; padding: 24px; border-left: 4px solid #cc1f1f;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; width: 40%;">Name</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">${inquiry.name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Phone</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">${inquiry.phone}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Email</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${inquiry.email}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Inquiry Type</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #cc1f1f;">${typeLabels[inquiry.inquiryType] ?? inquiry.inquiryType}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Message</td>
                <td style="padding: 10px 0;">${inquiry.message}</td>
              </tr>
            </table>
          </div>
          <p style="color: #999; font-size: 11px; margin-top: 24px; text-align: center; letter-spacing: 1px;">SCAVA // BREW & PLAY // EST 2026 // NELLORE</p>
        </div>
      `,
    });
    logger.info("Contact notification email sent");
  } catch (err) {
    logger.error({ err }, "Failed to send contact notification email");
  }
}
