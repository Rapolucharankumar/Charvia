import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, college, graduationYear } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const existingWaitlist = await prisma.earlyAccessWaitlist.findUnique({
      where: { email },
    });

    if (existingWaitlist) {
      return NextResponse.json({ message: "Already on the waitlist" }, { status: 200 });
    }

    const waitlist = await prisma.earlyAccessWaitlist.create({
      data: {
        name,
        email,
        college,
        graduationYear,
      },
    });

    return NextResponse.json(waitlist, { status: 201 });
  } catch (error) {
    console.error("Waitlist Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
