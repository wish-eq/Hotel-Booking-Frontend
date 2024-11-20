"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface FormData {
  name: string;
  email: string;
  tel: string;
  password: string;
  role: string;
}

export default function RegisterPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    tel: "",
    password: "",
    role: "user",
  });

  const [error] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Registration failed.");
      }

      alert("Registration successful!");
      router.push("/auth/login");
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
        <h2 className="text-2xl font-bold mb-6 text-center text-green-400">
          Register
        </h2>
        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}
        {Object.keys(formData)
          .filter((key) => key !== "role") // Exclude "role" from rendering
          .map((key) => (
            <div className="mb-6" key={key}>
              <label className="block text-gray-400 text-sm font-bold mb-2">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
              <input
                type={key === "password" ? "password" : "text"}
                name={key}
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                value={formData[key as keyof FormData]}
                onChange={handleChange}
                className="bg-gray-700 text-white shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          ))}
        <div className="flex flex-col items-center">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full focus:outline-none transition-transform transform hover:scale-105"
          >
            Register
          </button>
          <button
            type="button"
            onClick={() => router.push("/auth/login")}
            className="text-blue-400 hover:text-blue-500 text-sm font-bold mt-4 focus:outline-none"
          >
            Already have an account? Sign in
          </button>
        </div>
      </form>
    </div>
  );
}
