import React from "react";
import { useNotification } from "../context/NotificationContext";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

export default function NotificationContainer() {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg animate-slide-in pointer-events-auto ${
            notif.type === "success"
              ? "bg-green-500 text-white"
              : notif.type === "error"
              ? "bg-red-500 text-white"
              : "bg-blue-500 text-white"
          }`}
        >
          {notif.type === "success" && (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          )}
          {notif.type === "error" && (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span className="text-sm font-medium">{notif.message}</span>
          <button
            onClick={() => removeNotification(notif.id)}
            className="ml-2 p-0.5 hover:bg-white hover:bg-opacity-20 rounded transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
