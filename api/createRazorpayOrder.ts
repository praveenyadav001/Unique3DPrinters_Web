// Creates a Razorpay order server-side. The secret key never reaches the browser.
// Vercel reads RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET from its Environment Variables.

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    console.error('Razorpay keys are not configured in environment variables.');
    return res.status(500).json({ error: 'Payment gateway is not configured.' });
  }

  try {
    const { amount, currency = 'INR', receipt } = req.body || {};

    // `amount` arrives in rupees; Razorpay expects the smallest currency unit (paise).
    const amountRupees = Number(amount);
    if (!amountRupees || amountRupees <= 0) {
      return res.status(400).json({ error: 'Invalid amount.' });
    }
    const amountPaise = Math.round(amountRupees * 100);

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

    const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: amountPaise,
        currency,
        receipt: receipt || `rcpt_${Date.now()}`,
        payment_capture: 1,
      }),
    });

    const data = await rzpRes.json();

    if (!rzpRes.ok) {
      console.error('Razorpay order creation failed:', data);
      return res
        .status(502)
        .json({ error: data?.error?.description || 'Failed to create payment order.' });
    }

    // keyId is the public Razorpay key — safe to return so the browser can open Checkout.
    return res.status(200).json({
      id: data.id,
      amount: data.amount,
      currency: data.currency,
      keyId,
    });
  } catch (error) {
    console.error('createRazorpayOrder error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
