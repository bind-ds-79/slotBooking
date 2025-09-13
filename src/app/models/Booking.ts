import mongoose, { Schema, Document } from "mongoose";

export interface InterFaceBooking extends Document {
  eventTypeId: string;
  startTime: Date;
  endTime: Date;
  attendeeName: string;
  attendeeEmail: string;
  type: "business" | "student" | "other";   // ✅ string union
  other?: string | null;                    // ✅ optional
  
}

const BookingSchema = new Schema<InterFaceBooking>({
  eventTypeId: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  attendeeName: { type: String, required: true },
  attendeeEmail: { type: String, required: true },
   type: {
    type: String,
    enum: ["business", "student", "other"], // Only one of these allowed
    required: true,
  },
  other: {
    type: String,
    default: null, // Only filled when type = "other"
  },
});

export default mongoose.models.Booking ||
mongoose.model<InterFaceBooking>("Booking", BookingSchema);
