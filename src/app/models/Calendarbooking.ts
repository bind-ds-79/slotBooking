import mongoose, { Schema, Document } from "mongoose";

export interface InterfaceBooking extends Document {
  user: string;
  email: string;
  type: string;
  other?: string;
  purpose: string;
  start: Date;
  end: Date;
}

const BookingSchema: Schema = new Schema(
  {
    user: { type: String, required: true },
    email: { type: String, required: true },
    type: { type: String, required: true },
    other: { type: String },
    purpose: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Booking ||
  mongoose.model<InterfaceBooking>("BookingCalender", BookingSchema);
