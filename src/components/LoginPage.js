import React, { useState } from "react";
import logo from "../Kilburnazon.png"

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost/workshop/employee-directory/login.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );
      const data = await response.json();
      if (data.user_id) {
        onLogin(data); // Pass user info to parent
      } else {
        alert(data.error || "Login failed");
      }
    } catch (err) {
      console.error("Error during login:", err);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      {/* Header with Logo */}
      <header className="w-full bg-[#232f3e] py-4 flex justify-center">
        <img src={logo} alt="Kilburnazon Logo" className="h-16" /> {/* Increased logo size */}
      </header>
  
      {/* Login Form Container */}
      <div className="w-full max-w-lg mt-20 p-10 bg-white rounded-lg shadow-lg"> {/* Adjusted size and spacing */}
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Sign-In</h2> {/* Centered and larger text */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full mt-2 px-4 py-3 border rounded-md focus:ring focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>
  
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mt-2 px-4 py-3 border rounded-md focus:ring focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>
  
          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-3 rounded-md focus:outline-none focus:ring focus:ring-yellow-300"
          >
            Login
          </button>
        </form>
  
        <div className="mt-6 text-center text-sm">
          <a
            href="/forgot-password"
            className="block text-blue-600 hover:underline"
          >
            Forgot your password?
          </a>
          <a
            href="/register"
            className="block mt-2 text-blue-600 hover:underline"
          >
            Create your Kilburnazon account
          </a>
        </div>
      </div>
    </div>
  )};

export default LoginPage;