"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../../services/authService"; // Ensure the path is correct
import { setSession } from "../../utils/session"; // Ensure the path is correct

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      setSession({
        _id: data._id,
        name: data.name,
        email: data.email,
        token: data.token,
      });
      router.push("/homepage");
    } catch (err) {
      console.error(err); // Logs the error for debugging purposes
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 shadow-lg rounded px-8 pt-6 pb-8 mb-4 w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-400">
          Login
        </h2>
        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}
        <div className="mb-6">
          <label className="block text-gray-400 text-sm font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-700 text-white shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-400 text-sm font-bold mb-2">
            Password
          </label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-700 text-white shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col items-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full focus:outline-none transition-transform transform hover:scale-105"
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => router.push("/auth/register")}
            className="text-blue-400 hover:text-blue-500 text-sm font-bold mt-4 focus:outline-none"
          >
            Or Register
          </button>
        </div>
      </form>
    </div>
  );
}
