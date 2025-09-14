"use client";

import { useEffect, useState } from "react";

export default function AdminBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("/api/bookings");
        const data = await res.json();
        if (data.success) {
          setBookings(data.bookings);
        }
      } catch (err) {
        console.error("Error fetching bookings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading bookings...</p>;
  }

  if (bookings.length === 0) {
    return <p className="text-center text-gray-500">No bookings found</p>;
  }

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {bookings.map((b) => (
        <div
          key={b._id}
          className="bg-white shadow-lg rounded-2xl p-5 border border-gray-200 hover:shadow-xl transition"
        >
          <h2 className="text-lg font-semibold text-blue-600 mb-2">
            {b.attendeeName}
          </h2>
          <p className="text-sm text-gray-500 mb-1">
            <span className="font-medium">Email:</span> {b.attendeeEmail}
          </p>
          <p className="text-sm text-gray-500 mb-1">
            <span className="font-medium">Purpose:</span> {b.purpose}
          </p>
          <p className="text-sm text-gray-500 mb-1">
            <span className="font-medium">Type:</span>{" "}
            {b.type === "other" ? b.other : b.type}
          </p>
          <p className="text-sm text-gray-500 mb-1">
            <span className="font-medium">Start:</span>{" "}
            {new Date(b.startTime).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mb-1">
            <span className="font-medium">End:</span>{" "}
            {new Date(b.endTime).toLocaleString()}
          </p>

          {/* Example action buttons */}
          <div className="flex gap-3 mt-4">
            <button className="px-3 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600">
              Approve
            </button>
            <button className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600">
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}


