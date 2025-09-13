// /app/api/bookedSlots/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Booking from "@/app/models/Booking";

export async function GET() {
  await connectDB();

  // Get all bookings
  const bookings = await Booking.find({});

  // Count bookings per day
  const bookedDates: { [key: string]: number } = {};
  bookings.forEach((b) => {
    const date = new Date(b.startTime).toISOString().split("T")[0]; // YYYY-MM-DD
    bookedDates[date] = (bookedDates[date] || 0) + 1;
  });

  return NextResponse.json(bookedDates);
}
