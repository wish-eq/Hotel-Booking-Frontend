
import { Hotel, FormState } from "../interface";

export async function fetchHotels(): Promise<Hotel[]> {
  const response = await fetch("http://localhost:5000/api/v1/hotels");
  if (!response.ok) {
    throw new Error("Failed to fetch hotels");
  }
  const data = await response.json();
  return data.data || [];
}

export async function createHotel(hotelData: FormState) {
  const response = await fetch("http://localhost:5000/api/v1/hotels", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MmRlYmIyNWM2ZjQ5MWJjMjI3YzQ2OCIsImlhdCI6MTczMTA4NDM5NSwiZXhwIjoxNzYyNjIwMzk1fQ.ztVEJk6BXQYLly1ujF2v2eN5wzSdsb0NKdY9tdSI06A",
    },
    body: JSON.stringify(hotelData),
  });
  if (!response.ok) {
    throw new Error("Failed to create hotel");
  }
  return await response.json();
}

