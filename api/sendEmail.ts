import { Resend } from 'resend';

// Vercel securely reads this from its Environment Variables dashboard
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: any, res: any) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { orderId, status, customerEmail, customerName } = req.body;

    if (!orderId || !status || !customerEmail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const emailSubject = `Order Update: Your Unique3DPrinters order is now ${status}!`;
    const emailHtml = `
      <div style="font-family: sans-serif; color: #333;">
        <h2>Hello ${customerName || 'Customer'},</h2>
        <p>Great news! Your 3D printing order (<strong>#${orderId}</strong>) has been updated.</p>
        <p>Current Status: <strong style="color: #2563EB;">${status}</strong></p>
        <p>You can track your order anytime on our dashboard.</p>
        <p>Thank you for choosing Unique3DPrinters!</p>
      </div>
    `;

    // Send the email using Resend
    // NOTE: 'onboarding@resend.dev' is for testing. Once you verify your domain on Resend,
    // change this to something like 'noreply@yourdomain.com'
    const data = await resend.emails.send({
      from: 'Unique3DPrinters <onboarding@resend.dev>',
      to: [customerEmail],
      subject: emailSubject,
      html: emailHtml,
    });

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
