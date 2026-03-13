import { useState, useEffect } from "react";
import axios from "axios";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState("all");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/notifications/");
      setNotifications(res.data);
    } catch {
      setError("Cannot connect to server!");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const sendNotification = async () => {
    setSuccess(""); setError("");
    if (!title || !message) {
      setError("Title and Message are required!");
      return;
    }
    try {
      await axios.post("http://127.0.0.1:8000/notifications/", {
        title, message, target
      });
      setSuccess("✅ Notification sent successfully!");
      setTitle(""); setMessage(""); setTarget("all");
      fetchNotifications();
    } catch {
      setError("Failed to send notification!");
    }
  };

  const markAsRead = async (id) => {
    await axios.put(`http://127.0.0.1:8000/notifications/${id}/read`);
    fetchNotifications();
  };

  const deleteNotification = async (id) => {
    if (window.confirm("Delete this notification?")) {
      await axios.delete(`http://127.0.0.1:8000/notifications/${id}`);
      fetchNotifications();
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-yellow-500 text-white px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold">🔔 Smart Campus - Notifications</h1>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
              {unreadCount} New
            </span>
          )}
        </div>
        <a href="/admin" className="bg-white text-yellow-500 px-4 py-1 rounded-lg font-semibold">
          ← Back
        </a>
      </nav>

      <div className="p-6">
        {/* Send Form */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-700 mb-4">📤 Send Notification</h2>
          {success && <p className="text-green-500 mb-4">{success}</p>}
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Notification Title *"
              className="border rounded-lg px-4 py-2"
              value={title} onChange={(e) => setTitle(e.target.value)} />
            <select className="border rounded-lg px-4 py-2"
              value={target} onChange={(e) => setTarget(e.target.value)}>
              <option value="all">📢 All Users</option>
              <option value="student">👨‍🎓 Students Only</option>
              <option value="teacher">👨‍🏫 Teachers Only</option>
            </select>
            <textarea placeholder="Notification Message *"
              className="border rounded-lg px-4 py-2 col-span-2" rows="3"
              value={message} onChange={(e) => setMessage(e.target.value)} />
          </div>
          <button onClick={sendNotification}
            className="mt-4 bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 font-semibold">
            📤 Send Notification
          </button>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-700 mb-4">
            🔔 Notifications ({notifications.length})
          </h2>
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-4xl mb-4">🔔</p>
              <p>No notifications yet!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {notifications.map((n) => (
                <div key={n.id}
                  className={`p-4 rounded-xl border-l-4 flex justify-between items-start ${
                    n.is_read
                      ? "bg-gray-50 border-gray-300"
                      : "bg-yellow-50 border-yellow-400"
                  }`}>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-800">{n.title}</h3>
                      {!n.is_read && (
                        <span className="bg-yellow-400 text-white text-xs px-2 py-0.5 rounded-full">
                          New
                        </span>
                      )}
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        n.target === "all" ? "bg-blue-100 text-blue-700" :
                        n.target === "student" ? "bg-green-100 text-green-700" :
                        "bg-purple-100 text-purple-700"
                      }`}>
                        {n.target === "all" ? "📢 All" :
                         n.target === "student" ? "👨‍🎓 Students" : "👨‍🏫 Teachers"}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">{n.message}</p>
                    <p className="text-gray-400 text-xs mt-1">
                      🕐 {new Date(n.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    {!n.is_read && (
                      <button onClick={() => markAsRead(n.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600">
                        ✅ Read
                      </button>
                    )}
                    <button onClick={() => deleteNotification(n.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600">
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}