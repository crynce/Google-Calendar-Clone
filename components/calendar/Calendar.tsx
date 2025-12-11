
"use client";

import { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useAuth } from "@/contexts/AuthContext";
import { getEvents, addEvent, updateEvent, deleteEvent, Event } from "@/lib/firebase/firestore";
import EventModal from "./EventModal";

export default function Calendar() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const calendarRef = useRef<FullCalendar>(null);

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user]);

  const fetchEvents = async () => {
    if (user) {
      const querySnapshot = await getEvents(user.uid);
      const userEvents = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Event, "id">),
      }));
      setEvents(userEvents);
    }
  };

  const handleDateClick = (arg: { date: Date; allDay: boolean }) => {
    setSelectedDate(arg.date);
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleEventClick = (arg: { event: { id: string; title: string; start: Date; end: Date; allDay: boolean } }) => {
    const event = events.find((e) => e.id === arg.event.id);
    if (event) {
      setSelectedEvent(event);
      setSelectedDate(null);
      setIsModalOpen(true);
    }
  };

  const handleEventDrop = async (arg: { event: { id: string; start: Date; end: Date; allDay: boolean } }) => {
    const { event } = arg;
    if (event.id) {
      await updateEvent(event.id, {
        start: event.start.toISOString(),
        end: event.end.toISOString(),
        allDay: event.allDay,
      });
      fetchEvents();
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setSelectedDate(null);
  };

  const handleModalSave = async (title: string) => {
    if (user) {
      if (selectedEvent) {
        await updateEvent(selectedEvent.id!, { title });
      } else if (selectedDate) {
        await addEvent({
          title,
          start: selectedDate.toISOString(),
          end: selectedDate.toISOString(),
          allDay: true,
          userId: user.uid,
        });
      }
      fetchEvents();
      handleModalClose();
    }
  };

  const handleEventDelete = async (id: string) => {
    await deleteEvent(id);
    fetchEvents();
    handleModalClose();
  };

  return (
    <div className="p-4">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events.map((e) => ({ ...e, start: new Date(e.start), end: new Date(e.end) }))}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
      />
      <EventModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleModalSave}
        onDelete={handleEventDelete}
        event={selectedEvent}
      />
    </div>
  );
}
