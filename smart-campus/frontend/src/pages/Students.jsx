import { useState, useEffect } from "react";
import axios from "axios";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/students/");
      setStudents(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const addStudent = async () => {
    setMessage("");
    setError("");
    try {
      await axios.post("http://127.0.0.1:8000/students/", {
        full_name: name,
        email: email,
        password: password,
      });
      setMessage("✅ Student added successfully!");
      setName("");
      setEmail("");
      setPassword("");
      fetchStudents();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed!");
    }
  };

  const deleteStudent = async (id) => {
    if (window.confirm("Delete this student?")) {
      await axios.delete(`http://127.0.0.1:8000/students/${id}`);
      fetchStudents();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">🎓 Smart Campus - Students</h1>
        <a href="/admin" className="bg-white text-blue-600 px-4 py-1 rounded-lg font-semibold">
          ← Back
        </a>
      </nav>

      <div className="p-6">
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-700 mb-4">➕ Add Student</h2>
          {message && <p className="text-green-500 mb-4">{message}</p>}
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            onClick={addStudent}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold"
          >
            Add Student
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-700 mb-4">👨‍🎓 Student List ({students.length})</h2>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-400">
                    No students found!
                  </td>
                </tr>
              ) : (
                students.map((s, i) => (
                  <tr key={s.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{i + 1}</td>
                    <td className="py-3 px-4 font-medium">{s.full_name}</td>
                    <td className="py-3 px-4 text-gray-600">{s.email}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => deleteStudent(s.id)}
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