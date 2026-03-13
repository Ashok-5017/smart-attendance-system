import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/auth/register", {
        full_name: fullName,
        email,
        password,
        role: "student",
      });
      setSuccess("Registered! Please login.");
      setError("");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed!");
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-2">
          🎓 Smart Campus
        </h2>
        <p className="text-center text-gray-500 mb-6">Create your account</p>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Name</label>
          <input type="text" className="w-full border rounded-lg px-4 py-2" placeholder="Enter your name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Email</label>
          <input type="email" className="w-full border rounded-lg px-4 py-2" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-1">Password</label>
          <input type="password" className="w-full border rounded-lg px-4 py-2" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button onClick={handleRegister} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold">
          Register
        </button>
        <p className="text-center text-gray-500 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 font-semibold">Login</a>
        </p>
      </div>
    </div>
  );
}