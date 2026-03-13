export default function StudentDashboard() {
  const name = localStorage.getItem("name");

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-green-600 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">🎓 Smart Campus - Student</h1>
        <div className="flex items-center gap-4">
          <span>Welcome, {name}!</span>
          <button onClick={handleLogout} className="bg-white text-green-600 px-4 py-1 rounded-lg font-semibold">
            Logout
          </button>
        </div>
      </nav>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-700 mb-6">Student Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <div className="text-4xl mb-2">📊</div>
            <h3 className="text-lg font-semibold text-gray-700">My Attendance</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">0%</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <div className="text-4xl mb-2">📚</div>
            <h3 className="text-lg font-semibold text-gray-700">My Subjects</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">0</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <div className="text-4xl mb-2">🎯</div>
            <h3 className="text-lg font-semibold text-gray-700">Activities</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">0</p>
          </div>
        </div>
      </div>
    </div>
  );
}