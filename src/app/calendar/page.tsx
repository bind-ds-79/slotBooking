
"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState, useEffect } from "react";
import BookingPopup from "../components/bookingPopup";

export default function CalendarPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<any | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  // ✅ Fetch bookings from backend
  useEffect(() => {
    const fetchBookings = async () => {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      console.log("data", data);
      if (data.success) {
        setEvents(
          data.bookings.map((b: any) => ({
            id: b._id,
            title: `${b.attendeeName} (${
              b.type === "other" ? b.other : b.type
            })`,
            start: b.startTime,
            end: b.endTime,
            backgroundColor: "blue",
            borderColor: "blue",
            textColor: "white",
            extendedProps: {
              email: b.attendeeEmail,
              purpose: b.purpose,
              type: b.type,
              other: b.other,
            },
          }))
        );
      }
    };
    fetchBookings();
  }, []);

  // ✅ Handle slot selection
  const handleSelect = (info: any) => {
    setSelectedSlot({ start: info.startStr, end: info.endStr });
  };

  // ✅ Refresh events after booking
  const handleClosePopup = () => {
    setSelectedSlot(null);
    fetch("/api/bookings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setEvents(
            data.bookings.map((b: any) => ({
              id: b._id,
              title: `${b.attendeeName} (${
                b.type === "other" ? b.other : b.type
              })`,
              start: b.startTime,
              end: b.endTime,
              backgroundColor: "blue",
              borderColor: "blue",
              textColor: "white",
              extendedProps: {
                email: b.attendeeEmail,
                purpose: b.purpose,
                type: b.type,
                other: b.other,
              },
            }))
          );
        }
      });
  };

  // ✅ Event click → show floating popup
  const handleEventClick = (info: any) => {
    const event = info.event;
    setSelectedEvent({
      id: event.id,
      title: event.title,
      email: event.extendedProps.email,
      type:
        event.extendedProps.type === "other"
          ? event.extendedProps.other
          : event.extendedProps.type,
      purpose: event.extendedProps.purpose,
      start: new Date(event.start).toLocaleString(),
      end: new Date(event.end).toLocaleString(),
    });
  };

  return (
    <div className="p-6 relative">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        selectable={true}
        select={handleSelect}
        events={events}
        eventClick={handleEventClick}
        height="80vh"
      />

      {/* Popup open on slot select */}

      {/* ✅ Floating event details card (Google Calendar style) */}
      {selectedEvent && (
        <div className="absolute top-32 left-1/2 -translate-x-1/2 z-50">
          <div className=" bg-white text-black rounded-xl p-4 w-96 border border-gray-200">
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold text-lg">{selectedEvent.title}</h2>
              <button
                className="btn btn-xs btn-circle btn-ghost"
                onClick={() => setSelectedEvent(null)}
              >
                ✕
              </button>
            </div>

            {/* Event details */}
            <div className="space-y-2 text-sm">
              <p>
                <strong>📅 Date:</strong> {selectedEvent.start.split(",")[0]}
              </p>
              <p>
                <strong>🕒 Time:</strong> {selectedEvent.start.split(",")[1]} -{" "}
                {selectedEvent.end.split(",")[1]}
              </p>
              <p>
                <strong>👤 Name:</strong> {selectedEvent.title}
              </p>
              <p>
                <strong>📧 Email:</strong> {selectedEvent.email}
              </p>
              <p>
                <strong>🏷 Type:</strong> {selectedEvent.type}
              </p>
            </div>

           
            {/* Actions */}
            <div className="flex justify-end gap-2 mt-4 items-center">
              <button className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md text-sm font-medium transition">
                New Slot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
