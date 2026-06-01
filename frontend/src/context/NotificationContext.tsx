import React, {
  createContext,
  useContext,
  useState,
} from "react";

interface Notification {
  id: number;
  message: string;
  type?: "success" | "error" | "info";
}

interface NotificationContextType {
  notifications: Notification[];

  showNotification: (
    msg: string,
    type?: Notification["type"]
  ) => void;

  clearNotifications: () => void;
}

const NotificationContext = createContext<
  NotificationContextType | undefined
>(undefined);

export const useNotification = () => {
  const ctx = useContext(
    NotificationContext
  );

  if (!ctx) {
    throw new Error(
      "useNotification must be used inside NotificationProvider"
    );
  }

  return ctx;
};

export const NotificationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const showNotification = (
    message: string,
    type: Notification["type"] = "info"
  ) => {
    const id = Date.now();

    const newNotif: Notification = {
      id,
      message,
      type,
    };

    /* Load history */
    const saved = JSON.parse(
      localStorage.getItem(
        "notif_history"
      ) || "[]"
    );

    /* Prevent duplicate messages */
    const alreadyExists = saved.some(
      (n: any) =>
        n.message === message
    );

    if (alreadyExists) {
      return;
    }

    /* Floating notification */
    setNotifications((prev) => [
      newNotif,
      ...prev,
    ]);

    /* Save notification history */
    const updated = [
      newNotif,
      ...saved,
    ].slice(0, 20);

    localStorage.setItem(
      "notif_history",
      JSON.stringify(updated)
    );

    /* Update unread counter */
    const unread =
      Number(
        localStorage.getItem(
          "unread_notifications"
        )
      ) || 0;

    localStorage.setItem(
      "unread_notifications",
      String(unread + 1)
    );

    /* Auto remove toast */
    setTimeout(() => {
      setNotifications((prev) =>
        prev.filter(
          (n) => n.id !== id
        )
      );
    }, 4000);
  };

  const clearNotifications = () => {
    localStorage.removeItem(
      "notif_history"
    );

    localStorage.setItem(
      "unread_notifications",
      "0"
    );
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        showNotification,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;