export const razorpayConfig = {
  keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_R8LWqMIquhFgdT',
  keySecret: process.env.RAZORPAY_KEY_SECRET || 'GBkWGNa1dFa9zv7yuEFU7gAK',
};

if (!razorpayConfig.keyId || !razorpayConfig.keySecret) {
  console.warn(
    '⚠️  Razorpay credentials not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.',
  );
}
