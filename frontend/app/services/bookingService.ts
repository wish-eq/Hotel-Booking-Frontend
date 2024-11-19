import { BookingRequest } from "../interface";

export async function fetchUserBookings() {
    const response = await fetch("http://localhost:5000/api/v1/bookings", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MmRlYjg0NWM2ZjQ5MWJjMjI3YzQ2NSIsImlhdCI6MTczMjAyMjEwNSwiZXhwIjoxNzYzNTU4MTA1fQ.yIxz-uUFW1tPAi0RheExhyfUTmnEDbZkEkRI81oTnnM",
      },
    });
  
    if (!response.ok) {
      throw new Error("Failed to fetch user bookings");
    }
  
    const data = await response.json();
    return data.data; 
  }
  
export async function createBooking(hotelId: string, bookingData: BookingRequest) {
  const response = await fetch(`http://localhost:5000/api/v1/hotels/${hotelId}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MmRlYjg0NWM2ZjQ5MWJjMjI3YzQ2NSIsImlhdCI6MTczMjAyMjEwNSwiZXhwIjoxNzYzNTU4MTA1fQ.yIxz-uUFW1tPAi0RheExhyfUTmnEDbZkEkRI81oTnnM",
    },
    body: JSON.stringify(bookingData),
  });
  if (!response.ok) {
    throw new Error("Failed to create booking");
  }
  return await response.json();
}

export async function updateBooking(bookingId: string, bookingData: BookingRequest) {
    const response = await fetch(`http://localhost:5000/api/v1/bookings/${bookingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MmRlYjg0NWM2ZjQ5MWJjMjI3YzQ2NSIsImlhdCI6MTczMjAyMjEwNSwiZXhwIjoxNzYzNTU4MTA1fQ.yIxz-uUFW1tPAi0RheExhyfUTmnEDbZkEkRI81oTnnM",
      },
      body: JSON.stringify(bookingData),
    });
    if (!response.ok) {
      throw new Error("Failed to update booking");
    }
    return await response.json();
  }
  
  export async function deleteBooking(bookingId: string) {
    const response = await fetch(`http://localhost:5000/api/v1/bookings/${bookingId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MmRlYjg0NWM2ZjQ5MWJjMjI3YzQ2NSIsImlhdCI6MTczMjAyMjEwNSwiZXhwIjoxNzYzNTU4MTA1fQ.yIxz-uUFW1tPAi0RheExhyfUTmnEDbZkEkRI81oTnnM",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to delete booking");
    }
  }
  