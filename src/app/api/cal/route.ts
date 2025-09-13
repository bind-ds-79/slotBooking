import { NextResponse } from "next/server";
import axios from "axios";
import { connectDB } from "@/app/lib/db";
import Booking from "@/app/models/Booking";
import { sendEmail } from "@/utils/mail";
import { adminEmailTemplate, customerEmailTemplate } from "@/utils/emailTemplates";

export async function POST(req: Request) {
  await connectDB();

  try {
    const body = await req.json();
    const { eventTypeId, startTime, endTime, attendeeName, attendeeEmail, type, other } = body;
   console.log("attendeeEmail email",body)
    //  Check if this email already booked any slot
    const existingEmailBooking = await Booking.findOne({ attendeeEmail });
    console.log("existingEmailBooking",existingEmailBooking)
    if (existingEmailBooking) {
      return NextResponse.json({ error: "You have already booked a slot." }, { status: 400 });
    }

    //  Check if slot is already booked by 2 people
    const sameSlotBookings = await Booking.find({
      startTime: new Date(startTime),
      endTime: new Date(endTime),
    });
    
    
    if (sameSlotBookings.length >= 2) {
      return NextResponse.json({ error: "This time slot is already fully booked." }, { status: 400 });
    }

    // Call Cal.com API
    const calRes = await axios.post(
      "https://api.cal.com/v1/",
      {
        eventTypeId: String(eventTypeId),
        start: startTime,
        end: endTime,
        attendees: [{ name: attendeeName, email: attendeeEmail }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.CAL_API_KEY}`,
        }
      }
    );

    // Save booking in MongoDB
    const booking = new Booking({
      eventTypeId,
      startTime,
      endTime,
      attendeeName,
      attendeeEmail,
      type,
      other,
    });

    await booking.save();

    // Send emails
    await sendEmail(
      attendeeEmail,
      "Booking Confirmed",
      customerEmailTemplate(attendeeName, booking.startTime, booking.endTime, booking.type, booking.other)
    );

    await sendEmail(
      process.env.ADMIN_EMAIL!,
      "New Slot Booked",
      adminEmailTemplate(attendeeName, attendeeEmail, booking.startTime, booking.endTime, booking.type, booking.other)
    );

    return NextResponse.json({ success: true, data: booking });
  } catch (error: any) {
    console.error("Booking Error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data?.message || "Booking failed" },
      { status: 500 }
    );
  }
}
