"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  Clock,
  MapPin,
  AlertTriangle,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarEvent {
  id: string;
  summary: string;
  start: string;
  end: string;
  location?: string;
  description?: string;
}

interface EmailCalendarEvent {
  title: string;
  description: string;
  date: string;
  startTime: string | null;
  endTime: string | null;
}

export function CalendarPopup({
  triggerClassName,
  emailEvents = [],
}: {
  triggerClassName?: string;
  emailEvents?: EmailCalendarEvent[];
}) {
  const [open, setOpen] = useState(false);
  const [googleEvents, setGoogleEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    if (open) {
      const fetchEvents = async () => {
        setLoading(true);
        setError(null);
        try {
          const res = await fetch("/api/calendar/events");
          const data = await res.json();
          if (data.success) {
            setGoogleEvents(data.events);
          } else {
            setError(data.error || "Failed to load Google Calendar data.");
          }
        } catch (err: any) {
          setError(err.message || "An error occurred fetching events.");
        } finally {
          setLoading(false);
        }
      };
      fetchEvents();
    }
  }, [open]);

  // Merge Google Calendar events and Email-extracted events
  const events: CalendarEvent[] = [...googleEvents];
  
  if (emailEvents) {
    emailEvents.forEach((ee, idx) => {
      const eeStart = ee.startTime || ee.date;
      const eeEnd = ee.endTime || ee.startTime || ee.date;
      
      const exists = googleEvents.some(
        (ge) =>
          ge.summary.toLowerCase() === ee.title.toLowerCase() &&
          new Date(ge.start).toDateString() === new Date(eeStart).toDateString()
      );
      
      if (!exists) {
        events.push({
          id: `email-event-${idx}-${ee.title}`,
          summary: ee.title,
          start: eeStart,
          end: eeEnd,
          description: ee.description,
        });
      }
    });
  }

  // Helper to normalize date to check start/end ranges
  const isDateBlocked = (date: Date) => {
    const checkTime = new Date(date).setHours(0, 0, 0, 0);
    return events.some((event) => {
      const start = new Date(event.start).setHours(0, 0, 0, 0);
      const end = new Date(event.end).setHours(23, 59, 59, 999);
      return checkTime >= start && checkTime <= end;
    });
  };

  // Get events on selected date
  const getSelectedDateEvents = () => {
    if (!selectedDate) return [];
    const checkTime = new Date(selectedDate).setHours(0, 0, 0, 0);
    return events.filter((event) => {
      const start = new Date(event.start).setHours(0, 0, 0, 0);
      const end = new Date(event.end).setHours(23, 59, 59, 999);
      return checkTime >= start && checkTime <= end;
    });
  };

  const dayEvents = getSelectedDateEvents();
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "All day";
    // Check if the time part is 00:00:00.000 and it's a date-only field
    if (isoString.length <= 10) return "All day";
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn("flex items-center gap-2", triggerClassName)}
        >
          <CalendarIcon className="h-4 w-4 text-primary" />
          Check Calendar Schedule
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Google Calendar Schedule
          </DialogTitle>
          <DialogDescription>
            View blocked slots and scheduled events fetched directly from your calendar.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading calendar data...</span>
          </div>
        ) : error ? (
          <div className="flex h-64 flex-col items-center justify-center text-center p-4">
            <AlertTriangle className="h-10 w-10 text-destructive mb-2" />
            <p className="font-semibold text-foreground">{error}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Please connect your Google Calendar in settings to enable this feature.
            </p>
            <Button onClick={() => setOpen(false)} className="mt-4" size="sm">
              Dismiss
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 mt-2">
            {/* Calendar View */}
            <div className="flex flex-col items-center border border-border p-2 rounded-xl bg-card">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="w-full flex justify-center"
                modifiers={{
                  blocked: (date) => isDateBlocked(date),
                }}
                modifiersClassNames={{
                  blocked: "bg-destructive/20 text-destructive font-semibold border border-destructive/40 hover:bg-destructive/30 hover:text-destructive",
                }}
              />
              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-destructive/20 border border-destructive/40" />
                  <span>Blocked / Scheduled</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-muted border border-border" />
                  <span>Available</span>
                </div>
              </div>
            </div>

            {/* Selected Date Events */}
            <div className="flex flex-col h-[320px]">
              <h3 className="font-medium text-foreground mb-3 flex items-center justify-between border-b pb-2">
                <span>
                  {selectedDate?.toLocaleDateString([], {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                {dayEvents.length > 0 ? (
                  <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full font-semibold">
                    Blocked ({dayEvents.length})
                  </span>
                ) : (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> Free Day
                  </span>
                )}
              </h3>

              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {dayEvents.length > 0 ? (
                  dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className="border border-border/80 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <h4 className="font-medium text-sm text-foreground mb-1.5">
                        {event.summary}
                      </h4>
                      <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3 w-3 text-destructive" />
                          <span>
                            {formatTime(event.start)} - {formatTime(event.end)}
                          </span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4">
                    <CheckCircle className="h-10 w-10 text-primary/40 mb-2" />
                    <p className="text-sm font-medium">No events scheduled</p>
                    <p className="text-xs text-muted-foreground/80 mt-0.5">
                      This date is wide open and available.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
