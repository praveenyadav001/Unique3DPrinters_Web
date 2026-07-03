// ─── Payment Service (Razorpay) ─────────────────────────────
// Flow: create an order on our server → open Razorpay Checkout →
// verify the returned signature on our server before treating it as paid.

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export interface PaymentPrefill {
  name?: string;
  email?: string;
  contact?: string;
}

declare global {
  interface Window {
    Razorpay?: any;
  }
}

// Lazily inject the Razorpay Checkout script once.
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);

    const existing = document.getElementById("razorpay-checkout-js");
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }

    const script = document.createElement("script");
    script.id = "razorpay-checkout-js";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function processPayment(
  amount: number,
  currency: string = "INR",
  prefill: PaymentPrefill = {}
): Promise<PaymentResult> {
  try {
    // 1. Create the order server-side (amount in rupees; server converts to paise).
    const orderRes = await fetch("/api/createRazorpayOrder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, currency }),
    });

    if (!orderRes.ok) {
      const err = await orderRes.json().catch(() => ({}));
      return { success: false, error: err.error || "Failed to initiate payment." };
    }

    const order = await orderRes.json(); // { id, amount, currency, keyId }

    // 2. Ensure the Checkout script is available.
    const loaded = await loadRazorpayScript();
    if (!loaded || !window.Razorpay) {
      return { success: false, error: "Unable to load the payment gateway. Check your connection." };
    }

    // 3. Open Checkout and resolve based on the outcome.
    return await new Promise<PaymentResult>((resolve) => {
      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Unique3DPrinters",
        description: "3D Printing Order",
        order_id: order.id,
        prefill: {
          name: prefill.name || "",
          email: prefill.email || "",
          contact: prefill.contact || "",
        },
        theme: { color: "#00E5FF" },
        handler: async (response: any) => {
          // 4. Verify the signature server-side before trusting success.
          try {
            const verifyRes = await fetch("/api/verifyRazorpayPayment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const result = await verifyRes.json().catch(() => ({ valid: false }));

            if (verifyRes.ok && result.valid) {
              resolve({ success: true, transactionId: response.razorpay_payment_id });
            } else {
              resolve({
                success: false,
                error: "Payment could not be verified. If money was deducted, it will be refunded.",
              });
            }
          } catch {
            resolve({ success: false, error: "Payment verification failed. Please contact support." });
          }
        },
        modal: {
          ondismiss: () => resolve({ success: false, error: "Payment cancelled." }),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (resp: any) => {
        resolve({ success: false, error: resp?.error?.description || "Payment failed." });
      });
      rzp.open();
    });
  } catch (e: any) {
    console.error("[Payment Service] Unexpected error:", e);
    return { success: false, error: e?.message || "An unexpected payment error occurred." };
  }
}
