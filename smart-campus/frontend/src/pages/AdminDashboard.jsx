import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const name = localStorage.getItem("name");
  const [stats, setStats] = useState({
    total_students: 0,
    total_teachers: 0,
    total_subjects: 0,
    total_activities: 0,
    total_timetable: 0,
    attendance_rate: 0,
    present_count: 0,
    total_attendance: 0,
  });
  const [notifications, setNotifications] = useState([]);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    fetchStats();
    fetchNotifications();
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/reports/summary");
      setStats(res.data);
    } catch {}
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/notifications/");
      setNotifications(res.data.filter(n => !n.is_read).slice(0, 3));
    } catch {}
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const cards = [
    { href: "/students", icon: "👨‍🎓", label: "Students", value: stats.total_students, color: "from-blue-500 to-blue-700", shadow: "shadow-blue-200" },
    { href: "/teachers", icon: "👨‍🏫", label: "Teachers", value: stats.total_teachers, color: "from-green-500 to-green-700", shadow: "shadow-green-200" },
    { href: "/subjects", icon: "📚", label: "Subjects", value: stats.total_subjects, color: "from-purple-500 to-purple-700", shadow: "shadow-purple-200" },
    { href: "/attendance", icon: "✅", label: "Attendance", value: `${stats.attendance_rate}%`, color: "from-orange-500 to-orange-700", shadow: "shadow-orange-200" },
    { href: "/activities", icon: "🎯", label: "Activities", value: stats.total_activities, color: "from-red-500 to-red-700", shadow: "shadow-red-200" },
    { href: "/timetable", icon: "📅", label: "Timetable", value: stats.total_timetable, color: "from-teal-500 to-teal-700", shadow: "shadow-teal-200" },
    { href: "/reports", icon: "📊", label: "Reports", value: "View", color: "from-indigo-500 to-indigo-700", shadow: "shadow-indigo-200" },
    { href: "/notifications", icon: "🔔", label: "Notifications", value: notifications.length > 0 ? `${notifications.length} New` : "0", color: "from-yellow-500 to-yellow-600", shadow: "shadow-yellow-200" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎓</span>
          <div>
            <h1 className="text-xl font-bold">Smart Campus</h1>
            <p className="text-xs text-blue-200">Admin Panel</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold">Welcome, {name}! 👋</p>
            <p className="text-xs text-blue-200">{time.toLocaleTimeString()}</p>
          </div>
          <button onClick={handleLogout}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
            🚪 Logout
          </button>
        </div>
      </nav>

      <div className="p-6 max-w-6xl mx-auto">

        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-6 mb-6 shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-1">Welcome back, {name}! 🎉</h2>
              <p className="text-blue-100">Here's what's happening in your campus today.</p>
              <p className="text-blue-200 text-sm mt-1">
                📅 {time.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
            <div className="text-6xl hidden md:block">🏫</div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow text-center border-l-4 border-blue-500">
            <p className="text-2xl font-bold text-blue-600">{stats.total_students}</p>
            <p className="text-sm text-gray-500">Total Students</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow text-center border-l-4 border-green-500">
            <p className="text-2xl font-bold text-green-600">{stats.total_teachers}</p>
            <p className="text-sm text-gray-500">Total Teachers</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow text-center border-l-4 border-orange-500">
            <p className="text-2xl font-bold text-orange-600">{stats.attendance_rate}%</p>
            <p className="text-sm text-gray-500">Attendance Rate</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow text-center border-l-4 border-purple-500">
            <p className="text-2xl font-bold text-purple-600">{stats.total_subjects}</p>
            <p className="text-sm text-gray-500">Total Subjects</p>
          </div>
        </div>

        {/* Main Cards */}
        <h3 className="text-lg font-bold text-gray-700 mb-4">📋 Quick Access</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {cards.map((card) => (
            <a key={card.href} href={card.href}>
              <div className={`bg-gradient-to-br ${card.color} text-white rounded-2xl p-5 text-center shadow-lg ${card.shadow} hover:scale-105 transition-transform cursor-pointer`}>
                <div className="text-4xl mb-2">{card.icon}</div>
                <h3 className="text-sm font-semibold opacity-90">{card.label}</h3>
                <p className="text-2xl font-bold mt-1">{card.value}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Recent Notifications */}
          <div className="bg-white rounded-2xl shadow p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-700">🔔 Recent Notifications</h3>
              <a href="/notifications" className="text-blue-500 text-sm hover:underline">View All</a>
            </div>
            {notifications.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No new notifications!</p>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-lg mb-2">
                  <p className="font-semibold text-sm text-gray-800">{n.title}</p>
                  <p className="text-xs text-gray-500">{n.message}</p>
                </div>
              ))
            )}
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-2xl shadow p-5">
            <h3 className="font-bold text-gray-700 mb-4">⚡ Quick Actions</h3>
            <div className="flex flex-col gap-2">
              <a href="/students" className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition">
                <span className="text-2xl">👨‍🎓</span>
                <div>
                  <p className="font-semibold text-gray-700">Add New Student</p>
                  <p className="text-xs text-gray-400">Manage student records</p>
                </div>
              </a>
              <a href="/attendance" className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl hover:bg-orange-100 transition">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="font-semibold text-gray-700">Mark Attendance</p>
                  <p className="text-xs text-gray-400">Today's attendance</p>
                </div>
              </a>
              <a href="/timetable" className="flex items-center gap-3 p-3 bg-teal-50 rounded-xl hover:bg-teal-100 transition">
                <span className="text-2xl">📅</span>
                <div>
                  <p className="font-semibold text-gray-700">View Timetable</p>
                  <p className="text-xs text-gray-400">Class schedule</p>
                </div>
              </a>
              <a href="/reports" className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition">
                <span className="text-2xl">📊</span>
                <div>
                  <p className="font-semibold text-gray-700">View Reports</p>
                  <p className="text-xs text-gray-400">Analytics & insights</p>
                </div>
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}