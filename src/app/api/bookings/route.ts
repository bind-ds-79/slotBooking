import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Booking from "@/app/models/Booking";

// export async function POST(req: Request) {
//   try {
//     await connectDB();
//     const data = await req.json();
//     const booking = await Booking.create(data);
//     return NextResponse.json({ success: true, booking }, { status: 201 });
//   } catch (err: any) {
//     return NextResponse.json({ success: false, error: err.message }, { status: 500 });
//   }
// }

export async function GET() {
  try {
    await connectDB();
    const bookings = await Booking.find({});
    return NextResponse.json({ success: true, bookings });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
