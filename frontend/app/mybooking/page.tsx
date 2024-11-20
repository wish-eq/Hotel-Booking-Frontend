"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Already imported in your file
import { getSession } from "@/app/utils/session"; // Import session utility
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
import { useTheme } from "../ThemeProvider";

export default function MyBookings() {
  const { isDarkMode } = useTheme();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const [editDates, setEditDates] = useState<{
    bookingDate: Dayjs | null;
    checkoutDate: Dayjs | null;
  }>({ bookingDate: null, checkoutDate: null });
  const router = useRouter();

  useEffect(() => {
    const session = getSession(); // Retrieve session
    if (!session || !session.token) {
      router.push("/auth/login"); // Redirect to login page if no session
    }
  }, []);

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
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-black text-white" : "bg-white text-black"
      } transition-colors duration-300`}
    >
      <div className="fixed top-0 left-0 right-0 z-50">
        <TopMenu />
      </div>
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
                <div
                  className={`shadow-lg relative rounded-lg overflow-hidden ${
                    isDarkMode
                      ? "bg-gray-800 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
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
                        className={`p-2 rounded-full focus:outline-none ${
                          isDarkMode
                            ? "bg-yellow-700 hover:bg-yellow-600 text-white"
                            : "bg-yellow-300 hover:bg-yellow-400 text-black"
                        }`}
                        aria-label="Edit Booking"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(booking._id)}
                        className={`p-2 rounded-full focus:outline-none ${
                          isDarkMode
                            ? "bg-red-700 hover:bg-red-600 text-white"
                            : "bg-red-300 hover:bg-red-400 text-black"
                        }`}
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
            PaperProps={{
              style: {
                backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                color: isDarkMode ? "#ffffff" : "#000000",
              },
            }}
          >
            <DialogTitle
              className={`${
                isDarkMode ? "text-white" : "text-black"
              } font-bold text-xl`}
            >
              Edit Booking
            </DialogTitle>
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
                    style: {
                      color: isDarkMode ? "#ffffff" : "#000000",
                    },
                  }}
                  InputProps={{
                    style: {
                      backgroundColor: isDarkMode ? "#374151" : "#f9fafb",
                      color: isDarkMode ? "#ffffff" : "#000000",
                    },
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
                  InputProps={{
                    inputProps: {
                      min: editDates.bookingDate
                        ? editDates.bookingDate.format("YYYY-MM-DD")
                        : undefined,
                    },
                    style: {
                      backgroundColor: isDarkMode ? "#374151" : "#f9fafb",
                      color: isDarkMode ? "#ffffff" : "#000000",
                    },
                  }}
                  InputLabelProps={{
                    shrink: true,
                    style: {
                      color: isDarkMode ? "#ffffff" : "#000000",
                    },
                  }}
                />
              </div>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setIsEditing(false)}
                style={{
                  color: isDarkMode ? "#9ca3af" : "#000000",
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditSubmit}
                style={{
                  color: isDarkMode ? "#ffffff" : "#000000",
                  backgroundColor: isDarkMode ? "#2563eb" : "#3b82f6",
                }}
              >
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </div>
    </div>
  );
}
