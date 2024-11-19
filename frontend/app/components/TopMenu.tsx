"use client";

import Link from "next/link";
import { useTheme } from "../ThemeProvider";

export default function TopMenu() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <nav
      className={`py-4 flex justify-around ${
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
      {/* <Link
        href="/information"
        className={`${
          isDarkMode ? "hover:text-yellow-400" : "hover:text-blue-600"
        } transition-colors duration-200`}
      >
        Information
      </Link>
      <Link
        href="/allbooking"
        className={`${
          isDarkMode ? "hover:text-yellow-400" : "hover:text-blue-600"
        } transition-colors duration-200`}
      >
        All Booking
      </Link>
      <Link
        href="/profile"
        className={`${
          isDarkMode ? "hover:text-yellow-400" : "hover:text-blue-600"
        } transition-colors duration-200`}
      >
        Profile
      </Link> */}
      <button
        className={`${
          isDarkMode ? "hover:text-yellow-400" : "hover:text-blue-600"
        } transition-colors duration-200`}
        onClick={toggleTheme}
      >
        {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      </button>
      <button
        className={`${
          isDarkMode ? "hover:text-yellow-400" : "hover:text-blue-600"
        } transition-colors duration-200`}
      >
        Sign-Out
      </button>
    </nav>
  );
}
