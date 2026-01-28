"use client";

import {
  useState,
  useEffect,
  useRef,
  useOptimistic,
  useTransition,
} from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useAuth } from "@/contexts/AuthContext";
import {
  getEvents,
  addEvent,
  updateEvent,
  deleteEvent,
  Event,
} from "@/lib/firebase/firestore";
import EventModal from "./EventModal";

export default function Calendar() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const calendarRef = useRef<FullCalendar>(null);
  const [isPending, startTransition] = useTransition();

  const [optimisticEvents, setOptimisticEvents] = useOptimistic(
    events,
    (prev, action: { type: string; payload: Event }) => {
      if (action.type === "add") {
        return [...prev, action.payload];
      }
      if (action.type === "update") {
        return prev.map((event) =>
          event.id === action.payload.id ? action.payload : event,
        );
      }
      if (action.type === "delete") {
        return prev.filter((event) => event.id !== action.payload.id);
      }
      return prev;
    },
  );

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user]);

  const fetchEvents = async () => {
    if (user) {
      console.log(user);
      const querySnapshot = await getEvents(user.uid);
      const userEvents = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Event, "id">),
      }));
      console.log(userEvents, "userEvents");
      startTransition(() => {
        setEvents(userEvents);
      });
    }
  };

  const handleDateClick = (arg: { date: Date; allDay: boolean }) => {
    setSelectedDate(arg.date);
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleEventClick = (arg: {
    event: {
      id: string;
      title: string;
      start: Date | null;
      end: Date | null;
      allDay: boolean;
    };
  }) => {
    const event = events.find((e) => e.id === arg.event.id);
    if (event) {
      setSelectedEvent(event);
      setSelectedDate(null);
      setIsModalOpen(true);
    }
  };

  const handleEventDrop = async (arg: {
    event: {
      id: string;
      start: Date | null;
      end: Date | null;
      allDay: boolean;
    };
  }) => {
    const { event } = arg;
    if (event.id && event.start) {
      await updateEvent(event.id, {
        start: event.start.toISOString(),
        end: event.end ? event.end.toISOString() : event.start.toISOString(),
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
    try {
      if (user) {
        if (selectedEvent) {
          await updateEvent(selectedEvent.id!, { title });
        } else if (selectedDate) {
          handleModalClose();
          startTransition(async () => {
            setOptimisticEvents({
              type: "add",
              payload: {
                title,
                start: selectedDate?.toISOString(),
                end: selectedDate?.toISOString(),
                allDay: true,
                userId: user?.uid,
              },
            });
            const response = await addEvent({
              title,
              start: selectedDate.toISOString(),
              end: selectedDate.toISOString(),
              allDay: true,
              userId: user.uid,
            });
          });
        }

        await fetchEvents();
      }
    } catch (error) {
      // console.error(error);
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
        events={optimisticEvents.map((e) => ({
          ...e,
          start: new Date(e.start),
          end: new Date(e.end),
        }))}
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
