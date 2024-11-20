"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <h1
        className="text-5xl font-extrabold mb-8 text-center animate-fade-in-up"
        style={{ animationDuration: "1.2s" }}
      >
        Welcome to <span className="text-blue-500">Hotel Booking</span>
      </h1>
      <p
        className="text-lg text-gray-400 mb-12 text-center animate-fade-in-up"
        style={{ animationDuration: "1.4s" }}
      >
        Experience the best way to book your stays. Fast, simple, and secure.
      </p>
      <div className="flex space-x-6">
        <button
          onClick={() => router.push("/auth/login")}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition duration-500 hover:scale-110 animate-fade-in-up"
          style={{ animationDuration: "1.6s" }}
        >
          Login
        </button>
        <button
          onClick={() => router.push("/auth/register")}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition duration-500 hover:scale-110 animate-fade-in-up"
          style={{ animationDuration: "1.8s" }}
        >
          Register
        </button>
      </div>
    </div>
  );
}
