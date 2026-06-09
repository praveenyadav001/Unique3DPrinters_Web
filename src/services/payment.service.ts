// This is a stub for the Payment Service.
// In a production app, you would integrate Stripe, Razorpay, or another gateway here.

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export async function processPayment(amount: number, currency: string = "INR"): Promise<PaymentResult> {
  console.log(`[Payment Service] Initiating payment for ${amount} ${currency}...`);
  
  // Simulate a network delay for the payment gateway popup/processing
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate 95% success rate
      const isSuccess = Math.random() > 0.05;
      
      if (isSuccess) {
        resolve({
          success: true,
          transactionId: `TXN-${Math.floor(Math.random() * 1000000)}`
        });
      } else {
        resolve({
          success: false,
          error: "Payment declined by bank."
        });
      }
    }, 2500);
  });
}
