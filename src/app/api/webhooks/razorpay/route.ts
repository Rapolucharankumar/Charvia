import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ error: "No signature found" }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || "";

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);

    if (event.event === "subscription.charged") {
      const subscriptionId = event.payload.subscription.entity.id;
      const currentPeriodEnd = new Date(event.payload.subscription.entity.current_end * 1000);
      const status = event.payload.subscription.entity.status;

      await prisma.user.updateMany({
        where: { razorpaySubscriptionId: subscriptionId },
        data: {
          subscriptionStatus: status,
          currentPeriodEnd: currentPeriodEnd,
          plan: "PRO"
        },
      });
    }

    if (event.event === "subscription.cancelled" || event.event === "subscription.halted") {
      const subscriptionId = event.payload.subscription.entity.id;

      await prisma.user.updateMany({
        where: { razorpaySubscriptionId: subscriptionId },
        data: {
          subscriptionStatus: "cancelled",
          plan: "FREE"
        },
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[RAZORPAY_WEBHOOK]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
