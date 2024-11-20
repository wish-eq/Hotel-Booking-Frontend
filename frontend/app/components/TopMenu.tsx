"use client";

import Link from "next/link";
import { useTheme } from "../ThemeProvider";
import { useRouter } from "next/navigation";
import { clearSession } from "@/app/utils/session";
import { useEffect, useState } from "react";
import { getUserInfo } from "@/app/services/authService";
import Image from "next/image";

interface UserInfo {
  data: {
    role: string;
    name: string;
    email: string;
    // [key: string]: any; // If there are other unknown fields
  };
}

export default function TopMenu() {
  const { isDarkMode, toggleTheme } = useTheme();
  const router = useRouter();

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const data = await getUserInfo();
        setUserInfo(data); // Set user information
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    }
    fetchUserData();
  }, []);

  const handleLogout = () => {
    clearSession(); // Clear session from cookies/localStorage
    router.push("/auth/login"); // Redirect to login page
  };

  return (
    <nav
      className={`py-4 flex justify-around items-center ${
        isDarkMode ? "bg-black text-white" : "bg-white text-black"
      } transition-colors duration-300`}
    >
      <Link
        href="/homepage"
        className={`${
          isDarkMode ? "hover:text-yellow-400" : "hover:text-blue-600"
        } transition-colors duration-200`}
      >
        Home
      </Link>
      <Link
        href="/mybooking"
        className={`${
          isDarkMode ? "hover:text-yellow-400" : "hover:text-blue-600"
        } transition-colors duration-200`}
      >
        My Booking
      </Link>
      <button
        className={`${
          isDarkMode ? "hover:text-yellow-400" : "hover:text-blue-600"
        } transition-colors duration-200`}
        onClick={toggleTheme}
      >
        {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      </button>

      {/* User Information */}
      {userInfo && (
        <div className="flex items-center space-x-2">
          <Image
            src={`https://picsum.photos/seed/${userInfo.data.name}/50`} // Dynamic image seed
            alt="User Profile"
            className="w-10 h-10 rounded-full border border-gray-300"
          />
          <span
            className={`${
              isDarkMode ? "text-yellow-400" : "text-blue-600"
            } font-semibold`}
          >
            {userInfo.data.name}
          </span>
        </div>
      )}

      <button
        className={`${
          isDarkMode ? "hover:text-yellow-400" : "hover:text-blue-600"
        } transition-colors duration-200`}
        onClick={handleLogout}
      >
        Sign-Out
      </button>
    </nav>
  );
}
