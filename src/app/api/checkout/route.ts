import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

export async function POST() {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || "",
      key_secret: process.env.RAZORPAY_KEY_SECRET || "",
    });

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let customerId = dbUser.razorpayCustomerId;

    if (!customerId) {
      const customer = await razorpay.customers.create({
        email: dbUser.email,
        name: `${dbUser.firstName || ''} ${dbUser.lastName || ''}`.trim(),
      });
      customerId = customer.id;

      await prisma.user.update({
        where: { id: user.id },
        data: { razorpayCustomerId: customerId },
      });
    }

    // Replace with your actual Razorpay Plan ID
    const planId = process.env.RAZORPAY_PRO_PLAN_ID || ""; 

    if (!planId) {
      console.error("Missing RAZORPAY_PRO_PLAN_ID in env.");
      return NextResponse.json({ error: "Billing not fully configured" }, { status: 500 });
    }

    // Create a subscription
    const subscription = await (razorpay.subscriptions.create as any)({
      plan_id: planId,
      customer_notify: 1,
      quantity: 1,
      total_count: 120, // Example: 10 years
      customer_id: customerId,
    });

    return NextResponse.json({
      subscriptionId: subscription.id,
    });
  } catch (error: any) {
    console.error("[RAZORPAY_CHECKOUT]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
