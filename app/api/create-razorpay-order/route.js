import Razorpay from 'razorpay';
import { NextResponse } from 'next/server';

const getRazorpayClient = () => {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_TEST_KEY;
  const keySecret = process.env.RAZORPAY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials are not configured");
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};

export async function POST(req) {
  try {
    // Parse the request body
    const body = await req.json();
    const { amount } = body;

    // Validate amount
    if (!amount || isNaN(amount)) {
      return NextResponse.json(
        { error: "Valid amount is required" },
        { status: 400 }
      );
    }

    const options = {
      amount: Number(amount),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    };

    const razorpay = getRazorpayClient();
    const order = await razorpay.orders.create(options);
    
    return NextResponse.json(
      { order }, 
      { status: 200 }
    );

  } catch (error) {
    console.error('Razorpay order creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}
