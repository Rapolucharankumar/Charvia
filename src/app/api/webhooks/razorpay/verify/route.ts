import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature } = body;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET || "";

    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_payment_id + "|" + razorpay_subscription_id)
      .digest("hex");

    if (generatedSignature === razorpay_signature) {
      // Payment verified successfully. Update user.
      await prisma.user.update({
        where: { id: user.id },
        data: {
          plan: "PRO",
          razorpaySubscriptionId: razorpay_subscription_id,
          subscriptionStatus: "active",
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Approximate 1 month for instant feedback
        },
      });

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  } catch (error) {
    console.error("[RAZORPAY_VERIFY]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
