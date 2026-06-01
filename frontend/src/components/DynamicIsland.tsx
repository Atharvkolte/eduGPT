import React, { useState, useEffect } from "react";
import { Bell, Trash2 } from "lucide-react";
import { useNotification } from "../context/NotificationContext";
import "./DynamicIsland.css";

const DynamicIsland: React.FC = () => {
  const {
    notifications,
    clearNotifications,
  } = useNotification();

  const [open, setOpen] = useState(false);

  const [history, setHistory] = useState<any[]>([]);

  const [unreadCount, setUnreadCount] =
    useState(0);

  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem(
        "notif_history"
      ) || "[]"
    );

    setHistory(saved);

    const unread =
      Number(
        localStorage.getItem(
          "unread_notifications"
        )
      ) || 0;

    setUnreadCount(unread);
  }, [notifications]);

  const handleClear = () => {
    clearNotifications();
    setHistory([]);
    setUnreadCount(0);
  };

  return (
    <>
      <div className="notification-bell">
        <button
          className="bell-btn"
          onClick={() => {
            setOpen(!open);

            localStorage.setItem(
              "unread_notifications",
              "0"
            );

            setUnreadCount(0);
          }}
        >
          <Bell size={20} />

          {unreadCount > 0 && (
            <span className="bell-badge">
              {unreadCount > 99
                ? "99+"
                : unreadCount}
            </span>
          )}
        </button>
      </div>

      {open && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h4>Notifications</h4>

            {history.length > 0 && (
              <button
                className="clear-btn"
                onClick={handleClear}
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="empty-notification">
              No notifications
            </div>
          ) : (
            history.map((n) => (
              <div
                key={n.id}
                className="notification-item"
              >
                {n.message}
              </div>
            ))
          )}
        </div>
      )}

      <div className="island-container">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`island ${
              n.type || "info"
            }`}
          >
            {n.message}
          </div>
        ))}
      </div>
    </>
  );
};

export default DynamicIsland;