"use client";

import { useEffect, useState } from "react";
import {
  fetchUserBookings,
  updateBooking,
  deleteBooking,
} from "@/app/services/bookingService";
import { Booking } from "../interface";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { format } from "date-fns";
import TopMenu from "../components/TopMenu";
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
        const data = await fetchUserBookings(); // Fetches the data using API
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
      // Refresh the bookings list
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
    <div className="p-8 bg-black text-white min-h-screen">
      <TopMenu />

      <Typography variant="h4" align="center" gutterBottom>
        My Bookings
      </Typography>
      {bookings.length === 0 ? (
        <Typography align="center">No bookings found.</Typography>
      ) : (
        <Grid container spacing={4}>
          {bookings.map((booking) => (
            <Grid item xs={12} md={6} lg={4} key={booking._id}>
              <Card className="bg-gray-800 text-white shadow-lg relative">
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
                      className="text-yellow-500 hover:text-yellow-600 focus:outline-none"
                      aria-label="Edit Booking"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(booking._id)}
                      className="text-red-500 hover:text-red-600 focus:outline-none"
                      aria-label="Delete Booking"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {isEditing && currentBooking && (
        <Dialog open={isEditing} onClose={() => setIsEditing(false)}>
          <DialogTitle>Edit Booking</DialogTitle>
          <DialogContent>
            <div className="mt-4 w-[350px]">
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
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </div>
            <div className="mt-4">
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
                      alert("Checkout date cannot be before the booking date.");
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
                InputProps={{
                  inputProps: {
                    min: editDates.bookingDate
                      ? editDates.bookingDate.format("YYYY-MM-DD")
                      : undefined,
                  },
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsEditing(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleEditSubmit} color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}
