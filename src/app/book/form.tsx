"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

export default function BookingForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [bookingData, setBookingData] = useState<any>(null);
  const [userType, setUserType] = useState("");
  const router = useRouter();

  const [bookedDates, setBookedDates] = useState<{ [key: string]: number }>({});

  // refs for flatpickr
  const startTimeRef = useRef<HTMLInputElement | null>(null);
  const endTimeRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetch("/api/bookedSlots")
      .then((res) => res.json())
      .then((data) => setBookedDates(data));
  }, []);

  // Flatpickr init
useEffect(() => {
  if (startTimeRef.current) {
    flatpickr(startTimeRef.current, {
      enableTime: true,
      dateFormat: "Y-m-d\\TH:i", 
      minDate: "today",
      minuteIncrement: 30, // हर 30 मिनट का स्लॉट
      disable: [
        (date) => {
          const slotKey = date.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
          return bookedDates[slotKey] >= 2; // अगर 2 लोग बुक कर चुके हैं → disable
        },
      ],
    });
  }

  if (endTimeRef.current) {
    flatpickr(endTimeRef.current, {
      enableTime: true,
      dateFormat: "Y-m-d\\TH:i",
      minDate: "today",
      minuteIncrement: 30,
      disable: [
        (date) => {
          const slotKey = date.toISOString().slice(0, 16);
          return bookedDates[slotKey] >= 2;
        },
      ],
    });
  }
}, [bookedDates]);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    setBookingData(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      eventTypeId: "3318236",
      startTime: formData.get("startTime"),
      endTime: formData.get("endTime"),
      attendeeName: formData.get("attendeeName"),
      attendeeEmail: formData.get("attendeeEmail"),
      type: formData.get("type"),
      other: formData.get("other"),
    };

    try {
      const res = await fetch("/api/cal", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.CAL_API_KEY}`,
        },
      });

      const json = await res.json();
      console.log("Booking response:", json);

      if (res.ok) {
        setSuccess(true);
        setBookingData(json.data);
        router.push("/calendar");
      } else {
        setError(json.error || "Something went wrong");
      }
    } catch (err: any) {
      setError(err.message || "Network error, try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-8 border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Book a Slot
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <input
              type="text"
              name="attendeeName"
              placeholder="Enter your full name"
              className="w-full p-3 rounded-xl border border-gray-300 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Email
            </label>
            <input
              type="email"
              name="attendeeEmail"
              placeholder="example@email.com"
              className="w-full p-3 rounded-xl border border-gray-300 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Start Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Time
            </label>
            <input
              ref={startTimeRef}
              type="text"
              name="startTime"
              placeholder="Select start date & time"
              className="w-full p-3 rounded-xl border border-blue-300 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* End Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Time
            </label>
            <input
              ref={endTimeRef}
              type="text"
              name="endTime"
              placeholder="Select end date & time"
              className="w-full p-3 rounded-xl border border-blue-300 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Select option */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Type
            </label>
            <select
              name="type"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="w-full p-3 rounded-xl border border-blue-300 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            >
              <option value="">-- Select --</option>
              <option value="business">Business</option>
              <option value="student">Student</option>
              <option value="other">Other</option>
            </select>

            {userType === "other" && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Please specify
                </label>
                <input
                  type="text"
                  name="other"
                  placeholder="Enter your type"
                  className="w-full p-3 rounded-xl border border-blue-300 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Booking..." : "Book Now"}
          </button>
        </form>

        {/* Success message */}
        {success && (
          <p className="text-green-600 font-medium text-center mt-5">
            Slot booked successfully!
          </p>
        )}

        {/* Error message */}
        {error && (
          <p className="text-red-600 font-medium text-center mt-5">
            ⚠️ {error}
          </p>
        )}
      </div>
    </div>
  );
}
