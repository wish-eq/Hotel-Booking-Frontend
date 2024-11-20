import { BookingRequest } from "../interface";
import { getSession } from "@/app/utils/session";

export async function fetchUserBookings() {
  const session = getSession(); // Retrieve session
  if (!session || !session.token) {
    throw new Error("No token found. Please log in.");
  }

  const response = await fetch("http://localhost:5000/api/v1/bookings", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.token}`, // Use token from session
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user bookings");
  }

  const data = await response.json();
  return data.data;
}

export async function createBooking(hotelId: string, bookingData: BookingRequest) {
  const session = getSession(); // Retrieve session
  if (!session || !session.token) {
    throw new Error("No token found. Please log in.");
  }

  const response = await fetch(`http://localhost:5000/api/v1/hotels/${hotelId}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.token}`, // Use token from session
    },
    body: JSON.stringify(bookingData),
  });

  if (!response.ok) {
    throw new Error("Failed to create booking");
  }

  return await response.json();
}

export async function updateBooking(bookingId: string, bookingData: BookingRequest) {
  const session = getSession(); // Retrieve session
  if (!session || !session.token) {
    throw new Error("No token found. Please log in.");
  }

  const response = await fetch(`http://localhost:5000/api/v1/bookings/${bookingId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.token}`, // Use token from session
    },
    body: JSON.stringify(bookingData),
  });

  if (!response.ok) {
    throw new Error("Failed to update booking");
  }

  return await response.json();
}

export async function deleteBooking(bookingId: string) {
  const session = getSession(); // Retrieve session
  if (!session || !session.token) {
    throw new Error("No token found. Please log in.");
  }

  const response = await fetch(`http://localhost:5000/api/v1/bookings/${bookingId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${session.token}`, // Use token from session
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete booking");
  }
}
