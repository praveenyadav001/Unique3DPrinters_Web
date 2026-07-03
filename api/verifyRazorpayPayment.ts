// Verifies a Razorpay payment signature server-side. Never trust the client's
// "payment succeeded" claim — the signature proves the payment_id belongs to our order.

import crypto from 'crypto';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    console.error('RAZORPAY_KEY_SECRET is not configured.');
    return res.status(500).json({ error: 'Payment gateway is not configured.', valid: false });
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res
        .status(400)
        .json({ error: 'Missing payment verification fields.', valid: false });
    }

    const expected = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    // Constant-time compare; guard against length mismatch (timingSafeEqual throws otherwise).
    const expectedBuf = Buffer.from(expected);
    const signatureBuf = Buffer.from(String(razorpay_signature));
    const valid =
      expectedBuf.length === signatureBuf.length &&
      crypto.timingSafeEqual(expectedBuf, signatureBuf);

    return res.status(200).json({ valid });
  } catch (error) {
    console.error('verifyRazorpayPayment error:', error);
    return res.status(500).json({ error: 'Internal Server Error', valid: false });
  }
}
