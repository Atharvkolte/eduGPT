import React, { useState, useEffect } from "react";
import {CalendarDays,Flame,BookOpen,FileText,Rocket,LogOut} from "lucide-react";
import { useNotification } from "../context/NotificationContext";
import "../components/Calendar.css";
import { useNavigate } from "react-router-dom";

/* TYPES */
interface Event {
  date: string;
  topic: string;
  notes?: string;
}

/* COMPONENT */
const CalendarPanel: React.FC = () => {
  const [date, setDate] = useState("");
  const [topic, setTopic] = useState("");
  const [notesFile, setNotesFile] = useState<File | null>(null);

  const [events, setEvents] = useState<Event[]>(() => {
  try {
    return JSON.parse(
      localStorage.getItem("calendar_events") || "[]"
    );
  } catch {
    return [];
  }
  });

  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const formatDate = (date: string) => {
    const [y, m, d] = date.split("-");
    return `${d}-${m}-${y}`;
  };

  /* ADD EVENT */
  const addEvent = () => {
    if (!date || !topic) {
      showNotification(
        "⚠️ Please fill all required fields",
        "error"
      );
      return;
    }

    const newEvent: Event = {
      date,
      topic,
      notes: notesFile ? notesFile.name : undefined,
    };

    const updatedEvents = [...events, newEvent];

    setEvents(updatedEvents);

    localStorage.setItem(
      "calendar_events",
      JSON.stringify(updatedEvents)
    );

    setDate("");
    setTopic("");
    setNotesFile(null);

    showNotification(
      "✅ Topic added successfully",
      "success"
    );
  };

  /* DELETE EVENT */
  const deleteEvent = (index: number) => {
    const updated = events.filter((_, i) => i !== index);

    setEvents(updated);

    localStorage.setItem(
      "calendar_events",
      JSON.stringify(updated)
    );
  };

  /* DATA */
  const today = new Date().toISOString().split("T")[0];

  const sortedEvents = [...events].sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  const todayEvent = sortedEvents.find(
    (e) => e.date === today
  );

  /* ACTIVATE SCHEDULE */
  const activateSchedule = () => {
    localStorage.setItem(
      "schedule_active",
      "true"
    );

    const role = localStorage.getItem("role");

    if (role === "teacher") {
      showNotification(
        "🚀 Weekly Schedule Activated",
        "success"
      );
    }
  };

  /* STUDENT DAILY NOTIFICATION */
  useEffect(() => {
    if (!todayEvent) return;

    const role = localStorage.getItem("role");
    const active =
      localStorage.getItem("schedule_active");

    if (role !== "student") return;
    if (active !== "true") return;

    const today = new Date()
      .toISOString()
      .split("T")[0];

    const seenKey =
      `student_notification_seen_${today}`;

    if (localStorage.getItem(seenKey)) {
      return;
    }

    localStorage.setItem(seenKey, "shown");

    const timer = setTimeout(() => {
      showNotification(
        todayEvent.notes
          ? `📚 Today's Topic: ${todayEvent.topic} (Notes Available)`
          : `📚 Today's Topic: ${todayEvent.topic}`,
        "info"
      );
    }, 300);

    return () => clearTimeout(timer);
  }, [todayEvent, showNotification]);

  /* LOGOUT */
  const handleLogout = () => {
    localStorage.removeItem(
      "isAuthenticated"
    );

    localStorage.removeItem("role");

    navigate("/login");
  };

  /* UI */
  return (
    <div className="teacher-page">
      <div className="teacher-page-header">
        <h1>StudyAntra</h1>
        <p>Teacher Portal</p>
      </div>

      <div className="calendar-container">
        <div className="calendar-header">
          <h2 className="planner-title">
            <CalendarDays size={30} />
            Weekly Planner
          </h2>

          <button
            onClick={handleLogout}
            className="teacher-logout-btn"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        <div
          className={`today-card ${
            todayEvent ? "today-active" : ""
          }`}
        >
          <h3 className="today-title">
            <Flame size={22} />
            Today
          </h3>

          {todayEvent ? (
            <div className="today-topic">
              <BookOpen size={18} />
              {todayEvent.topic}
            </div>
          ) : (
            <div className="today-empty">
              No topic scheduled today
            </div>
          )}
        </div>

        {/* DASHBOARD STATS */}
        <div className="stats-grid">
          <div className="stat-card">
            <h4>Topics</h4>
            <span>{events.length}</span>
          </div>

          <div className="stat-card">
            <h4>Today</h4>

            <span className="stat-value">
              {todayEvent
                ? todayEvent.topic.length > 20
                  ? todayEvent.topic.slice(0, 20) +
                    "..."
                  : todayEvent.topic
                : "None"}
            </span>
          </div>

          <div className="stat-card">
            <h4>Status</h4>

            <span>
              {localStorage.getItem(
                "schedule_active"
              ) === "true"
                ? "Active"
                : "Inactive"}
            </span>
          </div>
        </div>

        {/* ADD TOPIC FORM */}
        <div className="event-form-row">
          <input
            type="date"
            value={date}
            onChange={(e) =>
              setDate(e.target.value)
            }
            className="calendar-input"
          />

          <input
            type="text"
            placeholder="Enter Topic"
            value={topic}
            onChange={(e) =>
              setTopic(e.target.value)
            }
            className="calendar-input"
          />

          <label className="upload-notes-btn">
            <FileText size={18} />
            Upload Notes

            <input
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx"
              onChange={(e) =>
                setNotesFile(
                  e.target.files?.[0] || null
                )
              }
              hidden
            />
          </label>

          <button
            onClick={addEvent}
            className="add-btn"
          >
            Add Topic
          </button>
        </div>

        {/* SCHEDULED TOPICS */}

        <div className="events-list">
          {sortedEvents.length === 0 ? (
            <div className="empty-schedule">
              <h3 className="empty-title">
                <BookOpen size={22} />
                No Topics Scheduled
              </h3>

              <p>
                Add your first topic to start
                planning student learning.
              </p>
            </div>
          ) : (
            sortedEvents.map((e, i) => (
              <div
                key={i}
                className={`event-card ${
                  e.date === today
                    ? "event-today"
                    : ""
                }`}
              >
                <div>
                  <div className="event-topic">
                    {e.topic}
                  </div>

                  <div className="event-date">
                    {formatDate(e.date)}
                  </div>

                  {e.notes && (
                    <div className="notes-file">
                      📄 Notes: {e.notes}
                    </div>
                  )}
                </div>

                <button
                  onClick={() =>
                    deleteEvent(i)
                  }
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>

        <button
          onClick={activateSchedule}
          className="activate-btn"
        >
          <Rocket size={18} />
          Activate Weekly Schedule
        </button>
      </div>
    </div>
  );
};

export default CalendarPanel;