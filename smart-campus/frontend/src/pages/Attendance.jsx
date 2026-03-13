import { useState, useEffect } from "react";
import axios from "axios";

export default function Attendance() {
  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [message, setMessage] = useState("");

  const fetchStudents = async () => {
    const res = await axios.get("http://127.0.0.1:8000/students/");
    setStudents(res.data);
  };

  const fetchRecords = async () => {
    const res = await axios.get("http://127.0.0.1:8000/attendance/");
    setRecords(res.data);
  };

  useEffect(() => {
    fetchStudents();
    fetchRecords();
  }, []);

  const markAttendance = async (studentId, status) => {
    try {
      await axios.post("http://127.0.0.1:8000/attendance/", {
        student_id: studentId,
        date: selectedDate,
        status: status,
      });
      setMessage(`✅ Attendance marked as ${status}!`);
      fetchRecords();
    } catch (err) {
      setMessage("Failed to mark attendance!");
    }
  };

  const deleteRecord = async (id) => {
    await axios.delete(`http://127.0.0.1:8000/attendance/${id}`);
    fetchRecords();
  };

  const todayRecords = records.filter((r) => r.date === selectedDate);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-orange-500 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">🎓 Smart Campus - Attendance</h1>
        <a href="/admin" className="bg-white text-orange-500 px-4 py-1 rounded-lg font-semibold">
          ← Back
        </a>
      </nav>

      <div className="p-6">
        {/* Date Selector */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-700 mb-4">📅 Select Date</h2>
          <input
            type="date"
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          {message && <p className="text-green-500 mt-2">{message}</p>}
        </div>

        {/* Mark Attendance */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-700 mb-4">
            ✅ Mark Attendance - {selectedDate}
          </h2>
          {students.length === 0 ? (
            <p className="text-gray-400">No students found! Add students first.</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr key={s.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{i + 1}</td>
                    <td className="py-3 px-4 font-medium">{s.full_name}</td>
                    <td className="py-3 px-4 flex gap-2">
                      <button
                        onClick={() => markAttendance(s.id, "present")}
                        className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 text-sm"
                      >
                        ✅ Present
                      </button>
                      <button
                        onClick={() => markAttendance(s.id, "absent")}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 text-sm"
                      >
                        ❌ Absent
                      </button>
                      <button
                        onClick={() => markAttendance(s.id, "late")}
                        className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 text-sm"
                      >
                        🕐 Late
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Attendance Records */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-700 mb-4">
            📊 Records for {selectedDate} ({todayRecords.length})
          </h2>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {todayRecords.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-400">
                    No records for this date!
                  </td>
                </tr>
              ) : (
                todayRecords.map((r, i) => (
                  <tr key={r.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{i + 1}</td>
                    <td className="py-3 px-4 font-medium">{r.student_name}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        r.status === "present"
                          ? "bg-green-100 text-green-600"
                          : r.status === "absent"
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}>
                        {r.status === "present" ? "✅ Present" : r.status === "absent" ? "❌ Absent" : "🕐 Late"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => deleteRecord(r.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 text-sm"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}