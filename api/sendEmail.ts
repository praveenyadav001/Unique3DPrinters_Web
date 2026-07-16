import nodemailer from 'nodemailer';

// Configure the SMTP transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL, // Your Gmail address
    pass: process.env.SMTP_PASSWORD, // Your Gmail App Password
  },
});

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

    let emailSubject = `Order Update: Your Unique3DPrinters order is now ${status}!`;
    let mainMessage = `Your 3D printing order (<strong>#${orderId}</strong>) has been updated.`;
    
    if (status === 'Placed') {
      emailSubject = `Order Confirmed: Thank you for your order #${orderId}!`;
      mainMessage = `Great news! We've received your 3D printing order (<strong>#${orderId}</strong>) and are getting it ready.`;
    } else if (status === 'Printing') {
      emailSubject = `Exciting news: We're printing your order #${orderId} right now! 🚀`;
      mainMessage = `Great news! We have started the 3D printing process for your order (<strong>#${orderId}</strong>). Your item is physically being created right now!`;
    } else if (status === 'Shipped') {
      emailSubject = `Your Unique3DPrinters order #${orderId} has shipped! 📦`;
      mainMessage = `Great news! Your order (<strong>#${orderId}</strong>) has been packed and handed over to our shipping partner.`;
    } else if (status === 'Delivered') {
      emailSubject = `Your order #${orderId} has been delivered! 🎉`;
      mainMessage = `Your order (<strong>#${orderId}</strong>) has been marked as delivered. We hope you love your new 3D printed item!`;
    } else if (status === 'Cancelled') {
      emailSubject = `Update regarding your Unique3DPrinters Order #${orderId}`;
      mainMessage = `Your order (<strong>#${orderId}</strong>) has been cancelled. If a refund is due, it will be processed shortly.`;
    }

    const emailHtml = `
      <div style="font-family: sans-serif; color: #333;">
        <h2>Hello ${customerName || 'Customer'},</h2>
        <p>${mainMessage}</p>
        <p>Current Status: <strong style="color: #2563EB;">${status}</strong></p>
        <p>You can track your order anytime on our dashboard.</p>
        <p>Thank you for choosing Unique3DPrinters!</p>
      </div>
    `;

    // Send the email using Nodemailer
    const info = await transporter.sendMail({
      from: `"Unique3DPrinters" <${process.env.SMTP_EMAIL}>`, // Sender address
      to: customerEmail, // Receiver address
      subject: emailSubject,
      html: emailHtml,
    });

    return res.status(200).json({ success: true, messageId: info.messageId });

  } catch (error: any) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
