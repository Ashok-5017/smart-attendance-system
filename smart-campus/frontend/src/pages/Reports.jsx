import { useState, useEffect } from "react";
import axios from "axios";

export default function Reports() {
  const [summary, setSummary] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [activeTab, setActiveTab] = useState("summary");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSummary();
    fetchStudents();
    fetchAttendance();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/reports/summary");
      setSummary(res.data);
    } catch {
      setError("Cannot connect to server!");
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/reports/students-list");
      setStudents(res.data);
    } catch {}
  };

  const fetchAttendance = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/reports/attendance-detail");
      setAttendance(res.data);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-green-600 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">📊 Smart Campus - Reports</h1>
        <a href="/admin" className="bg-white text-green-600 px-4 py-1 rounded-lg font-semibold">
          ← Back
        </a>
      </nav>

      <div className="p-6">
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-500 text-white rounded-2xl p-4 text-center shadow">
              <p className="text-3xl font-bold">{summary.total_students}</p>
              <p className="text-sm mt-1">👨‍🎓 Students</p>
            </div>
            <div className="bg-green-500 text-white rounded-2xl p-4 text-center shadow">
              <p className="text-3xl font-bold">{summary.total_teachers}</p>
              <p className="text-sm mt-1">👨‍🏫 Teachers</p>
            </div>
            <div className="bg-purple-500 text-white rounded-2xl p-4 text-center shadow">
              <p className="text-3xl font-bold">{summary.total_subjects}</p>
              <p className="text-sm mt-1">📚 Subjects</p>
            </div>
            <div className="bg-orange-500 text-white rounded-2xl p-4 text-center shadow">
              <p className="text-3xl font-bold">{summary.attendance_rate}%</p>
              <p className="text-sm mt-1">✅ Attendance Rate</p>
            </div>
            <div className="bg-teal-500 text-white rounded-2xl p-4 text-center shadow">
              <p className="text-3xl font-bold">{summary.total_activities}</p>
              <p className="text-sm mt-1">🎯 Activities</p>
            </div>
            <div className="bg-indigo-500 text-white rounded-2xl p-4 text-center shadow">
              <p className="text-3xl font-bold">{summary.total_timetable}</p>
              <p className="text-sm mt-1">📅 Timetable</p>
            </div>
            <div className="bg-pink-500 text-white rounded-2xl p-4 text-center shadow">
              <p className="text-3xl font-bold">{summary.present_count}</p>
              <p className="text-sm mt-1">✅ Present Count</p>
            </div>
            <div className="bg-red-500 text-white rounded-2xl p-4 text-center shadow">
              <p className="text-3xl font-bold">{summary.total_attendance}</p>
              <p className="text-sm mt-1">📋 Total Attendance</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button onClick={() => setActiveTab("students")}
            className={`px-4 py-2 rounded-lg font-semibold ${activeTab === "students" ? "bg-green-600 text-white" : "bg-white text-gray-600"}`}>
            👨‍🎓 Student Report
          </button>
          <button onClick={() => setActiveTab("attendance")}
            className={`px-4 py-2 rounded-lg font-semibold ${activeTab === "attendance" ? "bg-green-600 text-white" : "bg-white text-gray-600"}`}>
            ✅ Attendance Report
          </button>
        </div>

        {/* Student Report */}
        {activeTab === "students" && (
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-700 mb-4">
              👨‍🎓 Student Attendance Report ({students.length})
            </h2>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Total Days</th>
                  <th className="py-3 px-4">Present</th>
                  <th className="py-3 px-4">Rate</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-400">No data found!</td>
                  </tr>
                ) : (
                  students.map((s, i) => (
                    <tr key={s.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{i + 1}</td>
                      <td className="py-3 px-4 font-medium">{s.name}</td>
                      <td className="py-3 px-4 text-gray-500">{s.email}</td>
                      <td className="py-3 px-4">{s.total_attendance}</td>
                      <td className="py-3 px-4">{s.present}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-sm font-semibold ${
                          s.attendance_rate >= 75 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {s.attendance_rate}%
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Attendance Report */}
        {activeTab === "attendance" && (
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-700 mb-4">
              ✅ Attendance Detail Report ({attendance.length})
            </h2>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendance.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-gray-400">No data found!</td>
                  </tr>
                ) : (
                  attendance.map((a, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{i + 1}</td>
                      <td className="py-3 px-4 font-medium">{a.student_name}</td>
                      <td className="py-3 px-4">📅 {a.date}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-sm font-semibold ${
                          a.status === "Present" ? "bg-green-100 text-green-700" :
                          a.status === "Late" ? "bg-yellow-100 text-yellow-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}