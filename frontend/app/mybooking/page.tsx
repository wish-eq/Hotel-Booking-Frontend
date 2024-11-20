"use client";

import { useEffect, useState } from "react";
import {
  fetchUserBookings,
  updateBooking,
  deleteBooking,
} from "@/services/bookingService";
import { Booking } from "../interface";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

import { format } from "date-fns";
import { FaEdit, FaTrash } from "react-icons/fa";
import dayjs, { Dayjs } from "dayjs";

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const [editDates, setEditDates] = useState<{
    bookingDate: Dayjs | null;
    checkoutDate: Dayjs | null;
  }>({ bookingDate: null, checkoutDate: null });

  useEffect(() => {
    async function getBookings() {
      try {
        const data = await fetchUserBookings();
        setBookings(data);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
        setError("Failed to fetch bookings.");
      } finally {
        setLoading(false);
      }
    }
    getBookings();
  }, []);

  const handleEditClick = (booking: Booking) => {
    setCurrentBooking(booking);
    const bookingDate = dayjs(booking.bookingDate);
    const checkoutDate = dayjs(booking.checkoutDate);
    setEditDates({
      bookingDate,
      checkoutDate: bookingDate.isAfter(checkoutDate)
        ? bookingDate.add(1, "day")
        : checkoutDate,
    });
    setIsEditing(true);
  };

  const handleEditSubmit = async () => {
    if (!currentBooking || !editDates.bookingDate || !editDates.checkoutDate) {
      alert("Please select valid dates.");
      return;
    }

    if (editDates.checkoutDate.isBefore(editDates.bookingDate)) {
      alert("Checkout date cannot be before the booking date.");
      return;
    }

    const diffInDays = editDates.checkoutDate.diff(
      editDates.bookingDate,
      "day"
    );
    if (diffInDays > 3) {
      alert("You can only book up to 3 nights.");
      return;
    }

    try {
      await updateBooking(currentBooking._id, {
        bookingDate: editDates.bookingDate.format("YYYY-MM-DD"),
        checkoutDate: editDates.checkoutDate.format("YYYY-MM-DD"),
        createdAt: currentBooking.createdAt,
      });
      alert("Booking updated successfully!");
      setIsEditing(false);
      const updatedBookings = await fetchUserBookings();
      setBookings(updatedBookings);
    } catch (error) {
      console.error("Failed to update booking:", error);
    }
  };

  const handleDeleteClick = async (bookingId: string) => {
    if (confirm("Are you sure you want to delete this booking?")) {
      try {
        await deleteBooking(bookingId);
        setBookings(bookings.filter((booking) => booking._id !== bookingId));
        alert("Booking deleted successfully!");
      } catch (error) {
        console.error("Failed to delete booking:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-black">
      <div className="pt-20 p-8">
        <Typography variant="h4" align="center" gutterBottom>
          My Bookings
        </Typography>
        {bookings.length === 0 ? (
          <Typography align="center">No bookings found.</Typography>
        ) : (
          <div className="flex flex-wrap -mx-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="w-full md:w-1/2 lg:w-1/3 px-4 mb-8"
              >
                <div className="shadow-lg relative rounded-lg overflow-hidden bg-gray-200 text-black">
                  <img
                    src="https://picsum.photos/1280/720/?hotel%20room"
                    alt={`${booking.hotel.name} Image`}
                    className="w-full h-48 object-cover rounded-t-lg mb-4"
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {booking.hotel.name}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Address: {booking.hotel.address}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Tel: {booking.hotel.tel}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Booking Date:{" "}
                      {format(new Date(booking.bookingDate), "dd MMM yyyy")}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Checkout Date:{" "}
                      {format(new Date(booking.checkoutDate), "dd MMM yyyy")}
                    </Typography>
                    <Typography variant="caption" display="block" gutterBottom>
                      Created At:{" "}
                      {format(new Date(booking.createdAt), "dd MMM yyyy")}
                    </Typography>
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <button
                        onClick={() => handleEditClick(booking)}
                        className="p-2 rounded-full bg-yellow-300 hover:bg-yellow-400 text-black"
                        aria-label="Edit Booking"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(booking._id)}
                        className="p-2 rounded-full bg-red-300 hover:bg-red-400 text-black"
                        aria-label="Delete Booking"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </CardContent>
                </div>
              </div>
            ))}
          </div>
        )}
        {isEditing && currentBooking && (
          <Dialog
            open={isEditing}
            onClose={() => setIsEditing(false)}
          >
            <DialogTitle>Edit Booking</DialogTitle>
            <DialogContent>
              <TextField
                label="Booking Date"
                value={
                  editDates.bookingDate
                    ? editDates.bookingDate.format("YYYY-MM-DD")
                    : ""
                }
                onChange={(e) => {
                  const newBookingDate = dayjs(e.target.value);
                  setEditDates((prevDates) => ({
                    ...prevDates,
                    bookingDate: newBookingDate,
                    checkoutDate:
                      prevDates.checkoutDate &&
                      newBookingDate.isAfter(prevDates.checkoutDate)
                        ? newBookingDate.add(1, "day")
                        : prevDates.checkoutDate,
                  }));
                }}
                type="date"
                fullWidth
                variant="outlined"
              />
              <TextField
                label="Checkout Date"
                value={
                  editDates.checkoutDate
                    ? editDates.checkoutDate.format("YYYY-MM-DD")
                    : ""
                }
                onChange={(e) => {
                  const newCheckoutDate = dayjs(e.target.value);
                  setEditDates((prevDates) => {
                    if (newCheckoutDate.isBefore(prevDates.bookingDate)) {
                      alert(
                        "Checkout date cannot be before the booking date."
                      );
                      return prevDates;
                    }
                    return {
                      ...prevDates,
                      checkoutDate: newCheckoutDate,
                    };
                  });
                }}
                type="date"
                fullWidth
                variant="outlined"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button onClick={handleEditSubmit}>Submit</Button>
            </DialogActions>
          </Dialog>
        )}
      </div>
    </div>
  );
}
