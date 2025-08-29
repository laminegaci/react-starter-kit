import { Head, router, usePage } from "@inertiajs/react";
import { type BreadcrumbItem } from "@/types";
import AppLayout from "@/layouts/app-layout";
import Heading from "@/components/heading";
import { t } from "i18next";
import { useState, useEffect, useRef } from "react";
import FullCalendar, { DateClickArg, EventClickArg } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import toast from "react-hot-toast";

// Breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [
  { title: "Calendar", href: "/calendar" },
];

// Event type
interface CalendarEvent {
  id: number;
  title: string;
  start: string;
  end?: string;
}

export default function Calendar() {
  const { events: initialEvents } = usePage<{ events: CalendarEvent[] }>().props;
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);

  useEffect(() => {
    setEvents(initialEvents);
    }, [initialEvents]);

  // Add event
  const handleDateClick = (info: DateClickArg) => {
    const title = prompt("Enter event title:");
    if (!title) return;

    router.post(
      route("calendar.store"),
      { title, start: info.dateStr },
      {
        onSuccess: () => {
          // reload events from props
          router.reload({ only: ["events"] });  
          toast.success("Event added successfully");
        },
      }
    );
  };

  // Delete event
  const handleEventClick = (info: EventClickArg) => {
    if (!confirm(`Delete event '${info.event.title}'?`)) return;

    router.delete(route("calendar.destroy", info.event.id), {
      onSuccess: () => {
        router.reload({ only: ["events"] });
        toast.success("Event deleted successfully");
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t("Calendar")} />

      <div className="px-4 py-6 h-[90vh] flex flex-col">
        <Heading
          title={t("Calendar")}
          description={t("Manage your events and schedules")}
        />

        <div className="flex-1 p-4 bg-white rounded-2xl shadow">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            selectable={true}
            editable={false}
            events={events}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            height="100%"
          />
        </div>
      </div>
    </AppLayout>
  );
}
