import { useState, useEffect } from "react";
import axios from "axios";

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchActivities = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/activities/");
      setActivities(res.data);
    } catch {
      setError("Cannot connect to server!");
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const addActivity = async () => {
    setMessage("");
    setError("");
    if (!title || !date) {
      setError("Title and Date are required!");
      return;
    }
    try {
      await axios.post("http://127.0.0.1:8000/activities/", {
        title, description, date, location, organizer
      });
      setMessage("✅ Activity added successfully!");
      setTitle(""); setDescription(""); setDate("");
      setLocation(""); setOrganizer("");
      fetchActivities();
    } catch {
      setError("Failed to add activity!");
    }
  };

  const deleteActivity = async (id) => {
    if (window.confirm("Delete this activity?")) {
      await axios.delete(`http://127.0.0.1:8000/activities/${id}`);
      fetchActivities();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-purple-600 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">🎯 Smart Campus - Activities</h1>
        <a href="/admin" className="bg-white text-purple-600 px-4 py-1 rounded-lg font-semibold">
          ← Back
        </a>
      </nav>

      <div className="p-6">
        {/* Add Form */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-700 mb-4">➕ Add Activity</h2>
          {message && <p className="text-green-500 mb-4">{message}</p>}
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" placeholder="Activity Title *"
              className="border rounded-lg px-4 py-2"
              value={title} onChange={(e) => setTitle(e.target.value)} />
            <input type="date"
              className="border rounded-lg px-4 py-2"
              value={date} onChange={(e) => setDate(e.target.value)} />
            <input type="text" placeholder="Location"
              className="border rounded-lg px-4 py-2"
              value={location} onChange={(e) => setLocation(e.target.value)} />
            <input type="text" placeholder="Organizer"
              className="border rounded-lg px-4 py-2"
              value={organizer} onChange={(e) => setOrganizer(e.target.value)} />
            <input type="text" placeholder="Description"
              className="border rounded-lg px-4 py-2 col-span-2"
              value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <button onClick={addActivity}
            className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 font-semibold">
            Add Activity
          </button>
        </div>

        {/* Activities List */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-700 mb-4">
            🎯 Activities ({activities.length})
          </h2>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Organizer</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {activities.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-400">
                    No activities found!
                  </td>
                </tr>
              ) : (
                activities.map((a, i) => (
                  <tr key={a.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{i + 1}</td>
                    <td className="py-3 px-4 font-medium text-purple-700">{a.title}</td>
                    <td className="py-3 px-4">📅 {a.date}</td>
                    <td className="py-3 px-4">📍 {a.location || "-"}</td>
                    <td className="py-3 px-4">👤 {a.organizer || "-"}</td>
                    <td className="py-3 px-4">{a.description || "-"}</td>
                    <td className="py-3 px-4">
                      <button onClick={() => deleteActivity(a.id)}
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