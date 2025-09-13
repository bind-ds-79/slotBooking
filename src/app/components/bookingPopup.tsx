"use client";
import { useState, useEffect } from "react";

export default function BookingPopup({ slot, onClose }: any) {
  // If slot has existing booking info, prefill fields
  const [user, setUser] = useState(slot?.extendedProps?.attendeeName || "");
  const [email, setEmail] = useState(slot?.extendedProps?.email || "");
  const [type, setType] = useState(slot?.extendedProps?.type || "");
  const [other, setOther] = useState(slot?.extendedProps?.other || "");
  const [purpose, setPurpose] = useState(slot?.extendedProps?.purpose || "");

  // Determine if this is a booked slot or a new slot
  const isBooked = !!slot?.extendedProps?.email;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isBooked) return; // prevent editing booked slot

    const data = {
      user,
      email,
      type,
      other,
      purpose,
      start: slot.start,
      end: slot.end,
    };

    await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="card bg-base-100 w-96 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-xl font-bold">
            {isBooked ? "Booking Details" : "Book Slot"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              name="user"
              placeholder="Your Name"
              className="input input-bordered w-full"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
              disabled={isBooked} // disable if booked
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isBooked}
            />

            <select
              name="type"
              className="select select-bordered w-full"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              disabled={isBooked}
            >
              <option value="">Select Type</option>
              <option value="business">Business</option>
              <option value="student">Student</option>
              <option value="other">Other</option>
            </select>

            {type === "other" && (
              <input
                type="text"
                name="other"
                placeholder="Specify type"
                className="input input-bordered w-full"
                value={other}
                onChange={(e) => setOther(e.target.value)}
                required
                disabled={isBooked}
              />
            )}

            <textarea
              name="purpose"
              placeholder="Purpose of meeting"
              className="textarea textarea-bordered w-full"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              required
              disabled={isBooked}
            />

            <div className="card-actions justify-between">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-outline btn-error"
              >
                Close
              </button>
              {!isBooked && (
                <button
                  type="submit"
                  className="btn bg-blue-500 text-white hover:bg-blue-600"
                >
                  Confirm Booking
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
