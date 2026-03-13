import { useState, useEffect } from "react";
import axios from "axios";

export default function Timetable() {
  const [records, setRecords] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subject, setSubject] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [day, setDay] = useState("Monday");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [className, setClassName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const fetchRecords = async () => {
    const res = await axios.get("http://127.0.0.1:8000/timetable/");
    setRecords(res.data);
  };

  const fetchTeachers = async () => {
    const res = await axios.get("http://127.0.0.1:8000/teachers/");
    setTeachers(res.data);
  };

  useEffect(() => {
    fetchRecords();
    fetchTeachers();
  }, []);

  const addTimetable = async () => {
    setMessage("");
    setError("");
    try {
      await axios.post("http://127.0.0.1:8000/timetable/", {
        subject,
        teacher_id: parseInt(teacherId),
        day,
        start_time: startTime,
        end_time: endTime,
        class_name: className,
      });
      setMessage("✅ Timetable added!");
      setSubject("");
      setTeacherId("");
      setStartTime("");
      setEndTime("");
      setClassName("");
      fetchRecords();
    } catch (err) {
      setError("Failed to add!");
    }
  };

  const deleteRecord = async (id) => {
    if (window.confirm("Delete?")) {
      await axios.delete(`http://127.0.0.1:8000/timetable/${id}`);
      fetchRecords();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-teal-600 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">🎓 Smart Campus - Timetable</h1>
        <a href="/admin" className="bg-white text-teal-600 px-4 py-1 rounded-lg font-semibold">
          ← Back
        </a>
      </nav>

      <div className="p-6">
        {/* Add Form */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-700 mb-4">➕ Add Timetable</h2>
          {message && <p className="text-green-500 mb-4">{message}</p>}
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Subject"
              className="border rounded-lg px-4 py-2"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <select
              className="border rounded-lg px-4 py-2"
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
            >
              <option value="">Select Teacher</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>{t.full_name}</option>
              ))}
            </select>
            <select
              className="border rounded-lg px-4 py-2"
              value={day}
              onChange={(e) => setDay(e.target.value)}
            >
              {days.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <input
              type="time"
              className="border rounded-lg px-4 py-2"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
            <input
              type="time"
              className="border rounded-lg px-4 py-2"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
            <input
              type="text"
              placeholder="Class (e.g. Class 10A)"
              className="border rounded-lg px-4 py-2"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            />
          </div>
          <button
            onClick={addTimetable}
            className="mt-4 bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 font-semibold"
          >
            Add Timetable
          </button>
        </div>

        {/* Timetable List */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-700 mb-4">📅 Timetable ({records.length})</h2>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Teacher</th>
                <th className="py-3 px-4">Day</th>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-400">
                    No timetable found!
                  </td>
                </tr>
              ) : (
                records.map((r, i) => (
                  <tr key={r.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{i + 1}</td>
                    <td className="py-3 px-4 font-medium">{r.subject}</td>
                    <td className="py-3 px-4">{r.teacher_name}</td>
                    <td className="py-3 px-4">{r.day}</td>
                    <td className="py-3 px-4">{r.start_time} - {r.end_time}</td>
                    <td className="py-3 px-4">{r.class_name}</td>
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