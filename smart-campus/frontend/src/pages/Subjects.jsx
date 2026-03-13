import { useState, useEffect } from "react";
import axios from "axios";

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [className, setClassName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchSubjects = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/subjects/");
      setSubjects(res.data);
    } catch {
      setError("Cannot connect to server!");
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/teachers/");
      setTeachers(res.data);
    } catch {}
  };

  useEffect(() => {
    fetchSubjects();
    fetchTeachers();
  }, []);

  const addSubject = async () => {
    setMessage(""); setError("");
    if (!name || !code || !className) {
      setError("Name, Code and Class are required!");
      return;
    }
    try {
      await axios.post("http://127.0.0.1:8000/subjects/", {
        name, code,
        teacher_id: teacherId ? parseInt(teacherId) : null,
        class_name: className
      });
      setMessage("✅ Subject added successfully!");
      setName(""); setCode(""); setTeacherId(""); setClassName("");
      fetchSubjects();
    } catch {
      setError("Failed to add subject!");
    }
  };

  const deleteSubject = async (id) => {
    if (window.confirm("Delete this subject?")) {
      await axios.delete(`http://127.0.0.1:8000/subjects/${id}`);
      fetchSubjects();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-indigo-600 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">📚 Smart Campus - Subjects</h1>
        <a href="/admin" className="bg-white text-indigo-600 px-4 py-1 rounded-lg font-semibold">
          ← Back
        </a>
      </nav>

      <div className="p-6">
        {/* Add Form */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-700 mb-4">➕ Add Subject</h2>
          {message && <p className="text-green-500 mb-4">{message}</p>}
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Subject Name *"
              className="border rounded-lg px-4 py-2"
              value={name} onChange={(e) => setName(e.target.value)} />
            <input type="text" placeholder="Subject Code * (e.g. MATH101)"
              className="border rounded-lg px-4 py-2"
              value={code} onChange={(e) => setCode(e.target.value)} />
            <select className="border rounded-lg px-4 py-2"
              value={teacherId} onChange={(e) => setTeacherId(e.target.value)}>
              <option value="">Select Teacher (Optional)</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>{t.full_name}</option>
              ))}
            </select>
            <input type="text" placeholder="Class Name * (e.g. Class 10A)"
              className="border rounded-lg px-4 py-2"
              value={className} onChange={(e) => setClassName(e.target.value)} />
          </div>
          <button onClick={addSubject}
            className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 font-semibold">
            Add Subject
          </button>
        </div>

        {/* Subjects List */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-700 mb-4">
            📚 Subjects ({subjects.length})
          </h2>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Subject Name</th>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Teacher</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {subjects.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-400">
                    No subjects found!
                  </td>
                </tr>
              ) : (
                subjects.map((s, i) => (
                  <tr key={s.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{i + 1}</td>
                    <td className="py-3 px-4 font-medium text-indigo-700">{s.name}</td>
                    <td className="py-3 px-4">
                      <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-sm font-mono">
                        {s.code}
                      </span>
                    </td>
                    <td className="py-3 px-4">👤 {s.teacher_name}</td>
                    <td className="py-3 px-4">🏫 {s.class_name}</td>
                    <td className="py-3 px-4">
                      <button onClick={() => deleteSubject(s.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600">
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