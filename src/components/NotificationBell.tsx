import {
  Apple,
  Bell,
  Check,
  Dumbbell,
  MessageCircle,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { useNavigate } from "react-router-dom";

type Notification = {
  _id: string;
  title: string;
  message: string;
  type: "message" | "nutrition" | "training" | "progress" | "checkin" | "schedule" | "system";
  link?: string;
  isRead: boolean;
  createdAt: string;
};

const NotificationBell = () => {
  const navigate = useNavigate();
  const previousUnread = useRef(0);

  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const playSound = () => {
    const audio = new Audio("/notification.mp3");
    audio.volume = 0.4;
    audio.play().catch(() => {});
  };

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications/me");

      const newUnread = res.data.unreadCount || 0;

      if (previousUnread.current !== 0 && newUnread > previousUnread.current) {
        playSound();
      }

      previousUnread.current = newUnread;

      setNotifications(res.data.notifications || []);
      setUnreadCount(newUnread);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const markAllAsRead = async () => {
    await api.patch("/notifications/read-all");
    fetchNotifications();
  };

  const clearNotifications = async () => {
    await api.delete("/notifications/me");
    fetchNotifications();
  };

  const openNotification = async (notification: Notification) => {
    await api.patch(`/notifications/${notification._id}/read`);

    setOpen(false);

    if (notification.link) {
      navigate(notification.link);
    }

    fetchNotifications();
  };

  const getIcon = (type: Notification["type"]) => {
    if (type === "message") return <MessageCircle size={18} />;
    if (type === "nutrition") return <Apple size={18} />;
    if (type === "training") return <Dumbbell size={18} />;
    return <Bell size={18} />;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white transition hover:bg-white/20"
      >
        <Bell size={20} />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-black text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-14 z-[999] w-[360px] overflow-hidden rounded-[2rem] border border-white/10 bg-black/95 shadow-2xl shadow-black/60 backdrop-blur-2xl">
          <div className="flex items-center justify-between border-b border-white/10 p-5">
            <div>
              <h3 className="text-lg font-black text-white">
                Notifications
              </h3>
              <p className="text-xs text-zinc-500">
                {unreadCount} non lue(s)
              </p>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-zinc-300 hover:bg-white/20"
            >
              <X size={17} />
            </button>
          </div>

          <div className="max-h-[380px] overflow-y-auto p-3">
            {notifications.length === 0 ? (
              <div className="py-10 text-center text-sm text-zinc-500">
                Aucune notification.
              </div>
            ) : (
              notifications.map((item) => (
                <button
                  key={item._id}
                  onClick={() => openNotification(item)}
                  className={`mb-2 w-full rounded-2xl border p-4 text-left transition ${
                    item.isRead
                      ? "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                      : "border-red-500/30 bg-red-500/10 hover:bg-red-500/15"
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-red-600 text-white">
                      {getIcon(item.type)}
                    </div>

                    <div className="min-w-0">
                      <p className="font-black text-white">
                        {item.title}
                      </p>

                      <p className="mt-1 text-sm text-zinc-400">
                        {item.message}
                      </p>

                      <p className="mt-2 text-xs text-zinc-600">
                        {new Date(item.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          <div className="flex gap-2 border-t border-white/10 p-3">
            <button
              onClick={markAllAsRead}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm font-bold text-white hover:bg-white/20"
            >
              <Check size={16} />
              Tout lu
            </button>

            <button
              onClick={clearNotifications}
              className="flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 text-sm font-bold text-white hover:bg-red-700"
            >
              <Trash2 size={16} />
              Vider
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;