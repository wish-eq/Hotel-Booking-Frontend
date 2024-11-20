import { Hotel, FormState } from "../interface";
import { getSession } from "@/app/utils/session";

// user, admin
export async function fetchHotels(): Promise<Hotel[]> {
  const response = await fetch("http://localhost:5000/api/v1/hotels");
  if (!response.ok) {
    throw new Error("Failed to fetch hotels");
  }
  const data = await response.json();
  return data.data || [];
}

// admin
export async function createHotel(hotelData: FormState) {
  const session = getSession(); // Retrieve session
  if (!session || !session.token) {
    throw new Error("No token found. Please log in.");
  }

  const response = await fetch("http://localhost:5000/api/v1/hotels", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.token}`, // Use token from session
    },
    body: JSON.stringify(hotelData),
  });

  if (!response.ok) {
    throw new Error("Failed to create hotel");
  }

  return await response.json();
}

// admin
export async function updateHotel(id: string, hotelData: FormState) {
  const session = getSession(); // Retrieve session
  if (!session || !session.token) {
    throw new Error("No token found. Please log in.");
  }

  const response = await fetch(`http://localhost:5000/api/v1/hotels/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.token}`, // Use token from session
    },
    body: JSON.stringify(hotelData),
  });

  if (!response.ok) {
    throw new Error("Failed to update hotel");
  }

  return await response.json();
}

// admin
export async function deleteHotel(id: string) {
  const session = getSession(); // Retrieve session
  if (!session || !session.token) {
    throw new Error("No token found. Please log in.");
  }

  const response = await fetch(`http://localhost:5000/api/v1/hotels/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${session.token}`, // Use token from session
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete hotel");
  }
}
