"use client";

import { useEffect, useState, ChangeEvent } from "react";
import {
  fetchHotels,
  createHotel,
  deleteHotel,
  updateHotel,
} from "@/app/services/hotelService";
import { Hotel } from "../interface";
import { FaEdit, FaTrash } from "react-icons/fa";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import { createBooking } from "@/services/bookingService";

interface FormState {
  name: string;
  address: string;
  district: string;
  province: string;
  postalcode: string;
  tel: string;
  picture: string;
}

export default function Home() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [createForm, setCreateForm] = useState<FormState>({
    name: "",
    address: "",
    district: "",
    province: "",
    postalcode: "",
    tel: "",
    picture: "",
  });
  const [editForm, setEditForm] = useState<FormState>({
    name: "",
    address: "",
    district: "",
    province: "",
    postalcode: "",
    tel: "",
    picture: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentHotelId, setCurrentHotelId] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  const [bookingDates, setBookingDates] = useState<{
    bookingDate: Dayjs | null;
    checkoutDate: Dayjs | null;
  }>({ bookingDate: null, checkoutDate: null });

  useEffect(() => {
    async function getHotels() {
      try {
        const data = await fetchHotels();
        setHotels(data);
      } catch (error) {
        console.error("Failed to fetch hotels:", error);
      }
    }
    getHotels();
  }, []);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    formType: "create" | "edit"
  ) => {
    const { name, value } = e.target;
    const newValue =
      name === "tel"
        ? value.slice(0, 10)
        : name === "postalcode"
        ? value.slice(0, 5)
        : value;
    if (formType === "create") {
      setCreateForm({ ...createForm, [name]: newValue });
    } else {
      setEditForm({ ...editForm, [name]: newValue });
    }
  };

  const handleBookingClick = (hotelId: string) => {
    setCurrentHotelId(hotelId);
    setIsBooking(true);
  };

  const handleBookingSubmit = async () => {
    if (
      !currentHotelId ||
      !bookingDates.bookingDate ||
      !bookingDates.checkoutDate
    ) {
      alert("Please select valid dates.");
      return;
    }

    if (bookingDates.checkoutDate.isBefore(bookingDates.bookingDate)) {
      alert("Checkout date cannot be before the booking date.");
      return;
    }

    const diffInDays = bookingDates.checkoutDate.diff(
      bookingDates.bookingDate,
      "day"
    );
    if (diffInDays > 3) {
      alert("You can only book up to 3 nights.");
      return;
    }

    try {
      await createBooking(currentHotelId, {
        bookingDate: bookingDates.bookingDate.format("YYYY-MM-DD"),
        checkoutDate: bookingDates.checkoutDate.format("YYYY-MM-DD"),
        createdAt: dayjs().format("YYYY-MM-DD"),
      });
      alert("Booking created successfully!");
      setIsBooking(false);
    } catch (error) {
      console.error("Failed to create booking:", error);
    }
  };

  useEffect(() => {
    async function getHotels() {
      try {
        const data = await fetchHotels();
        setHotels(data);
      } catch (error) {
        console.error("Failed to fetch hotels:", error);
      }
    }
    getHotels();
  }, []);

  const handleSubmit = async () => {
    try {
      await createHotel(createForm);
      alert("Hotel created successfully!");
      setCreateForm({
        name: "",
        address: "",
        district: "",
        province: "",
        postalcode: "",
        tel: "",
        picture: "",
      });
      // Refresh the hotel list
      const updatedHotels = await fetchHotels();
      setHotels(updatedHotels);
    } catch (error) {
      console.error("Failed to create hotel:", error);
    }
  };

  const handleEditClick = (hotel: Hotel) => {
    setEditForm({
      name: hotel.name,
      address: hotel.address,
      district: hotel.district,
      province: hotel.province,
      postalcode: hotel.postalcode,
      tel: hotel.tel,
      picture: hotel.picture,
    });
    setCurrentHotelId(hotel.id);
    setIsEditing(true);
  };

  const handleDeleteClick = async (id: string) => {
    if (confirm("Are you sure you want to delete this hotel?")) {
      try {
        await deleteHotel(id);
        setHotels(hotels.filter((hotel) => hotel.id !== id));
        alert("Hotel deleted successfully!");
      } catch (error) {
        console.error("Failed to delete hotel:", error);
      }
    }
  };

  const handleEditSubmit = async () => {
    if (!currentHotelId) return;

    try {
      await updateHotel(currentHotelId, editForm);
      alert("Hotel updated successfully!");
      setIsEditing(false);
      // Refresh the hotel list
      const updatedHotels = await fetchHotels();
      setHotels(updatedHotels);
    } catch (error) {
      console.error("Failed to update hotel:", error);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">

      {isBooking && (
        <Dialog open={isBooking} onClose={() => setIsBooking(false)}>
          <DialogTitle>Book a Hotel</DialogTitle>
          <DialogContent>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className="mt-4">
                <TextField
                  label="Booking Date"
                  value={
                    bookingDates.bookingDate
                      ? bookingDates.bookingDate.format("YYYY-MM-DD")
                      : ""
                  }
                  onChange={(e) => {
                    const newBookingDate = dayjs(e.target.value);
                    setBookingDates((prevDates) => ({
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
              <div className="mt-4 w-[350px]">
                <TextField
                  label="Checkout Date"
                  value={
                    bookingDates.checkoutDate
                      ? bookingDates.checkoutDate.format("YYYY-MM-DD")
                      : ""
                  }
                  onChange={(e) => {
                    const newCheckoutDate = dayjs(e.target.value);
                    setBookingDates((prevDates) => {
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
                      min: bookingDates.bookingDate
                        ? bookingDates.bookingDate.format("YYYY-MM-DD")
                        : undefined,
                    },
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </div>
            </LocalizationProvider>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsBooking(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleBookingSubmit} color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4">Edit Hotel</h2>
            <label className="block mb-1">Hotel Name</label>
            <input
              type="text"
              name="name"
              placeholder="Hotel Name"
              value={editForm.name}
              onChange={(e) => handleInputChange(e, "edit")}
              className="block w-full p-3 mb-4 bg-gray-800 border border-gray-600 rounded focus:ring focus:ring-yellow-500 outline-none"
            />
            <label className="block mb-1">Address</label>
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={editForm.address}
              onChange={(e) => handleInputChange(e, "edit")}
              className="block w-full p-3 mb-4 bg-gray-800 border border-gray-600 rounded focus:ring focus:ring-yellow-500 outline-none"
            />
            <label className="block mb-1">District</label>
            <input
              type="text"
              name="district"
              placeholder="District"
              value={editForm.district}
              onChange={(e) => handleInputChange(e, "edit")}
              className="block w-full p-3 mb-4 bg-gray-800 border border-gray-600 rounded focus:ring focus:ring-yellow-500 outline-none"
            />
            <label className="block mb-1">Province</label>
            <input
              type="text"
              name="province"
              placeholder="Province"
              value={editForm.province}
              onChange={(e) => handleInputChange(e, "edit")}
              className="block w-full p-3 mb-4 bg-gray-800 border border-gray-600 rounded focus:ring focus:ring-yellow-500 outline-none"
            />
            <label className="block mb-1">Postal Code</label>
            <input
              type="text"
              name="postalcode"
              placeholder="Postal Code"
              value={editForm.postalcode}
              onChange={(e) => handleInputChange(e, "edit")}
              className="block w-full p-3 mb-4 bg-gray-800 border border-gray-600 rounded focus:ring focus:ring-yellow-500 outline-none"
            />
            <label className="block mb-1">Tel</label>
            <input
              type="text"
              name="tel"
              placeholder="Tel"
              value={editForm.tel}
              onChange={(e) => handleInputChange(e, "edit")}
              className="block w-full p-3 mb-4 bg-gray-800 border border-gray-600 rounded focus:ring focus:ring-yellow-500 outline-none"
            />
            <label className="block mb-1">Picture URL</label>
            <input
              type="text"
              name="picture"
              placeholder="Picture URL"
              value={editForm.picture}
              onChange={(e) => handleInputChange(e, "edit")}
              className="block w-full p-3 mb-4 bg-gray-800 border border-gray-600 rounded focus:ring focus:ring-yellow-500 outline-none"
            />
            <button
              onClick={handleEditSubmit}
              className="w-full p-3 bg-yellow-500 text-black font-semibold rounded hover:bg-yellow-600 transition-colors duration-300"
            >
              Save Changes
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="w-full p-3 mt-4 bg-gray-700 text-white font-semibold rounded hover:bg-gray-800 transition-colors duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="p-8">
        <h1 className="text-4xl font-extrabold mb-8 text-center">
          Explore Our Hotels
        </h1>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {hotels.map((hotel) => (
            <div
              key={hotel.id}
              className="p-4 bg-gray-800 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 relative"
            >
              <h2 className="text-2xl font-semibold mb-2">{hotel.name}</h2>
              <p className="text-gray-300">Address: {hotel.address}</p>
              <p className="text-gray-300">District: {hotel.district}</p>
              <p className="text-gray-300">Province: {hotel.province}</p>
              <p className="text-gray-300">Tel: {hotel.tel}</p>
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  onClick={() => handleEditClick(hotel)}
                  className="text-yellow-500 hover:text-yellow-600 focus:outline-none"
                  aria-label="Edit Hotel"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDeleteClick(hotel.id)}
                  className="text-red-500 hover:text-red-600 focus:outline-none"
                  aria-label="Delete Hotel"
                >
                  <FaTrash />
                </button>
              </div>
              <button
                onClick={() => handleBookingClick(hotel.id)}
                className="mt-4 w-full p-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
              >
                Book
              </button>
            </div>
          ))}
        </div>

        <h1 className="text-3xl font-bold mt-16 text-center">
          Create a New Hotel
        </h1>
        <div className="max-w-lg mx-auto mt-4 p-6 bg-gray-900 rounded-lg shadow-lg">
          <label className="block mb-1">Hotel Name</label>
          <input
            type="text"
            name="name"
            placeholder="Hotel Name"
            value={createForm.name}
            onChange={(e) => handleInputChange(e, "create")}
            className="block w-full p-3 mb-4 bg-gray-800 border border-gray-600 rounded focus:ring focus:ring-yellow-500 outline-none"
          />
          <label className="block mb-1">Address</label>
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={createForm.address}
            onChange={(e) => handleInputChange(e, "create")}
            className="block w-full p-3 mb-4 bg-gray-800 border border-gray-600 rounded focus:ring focus:ring-yellow-500 outline-none"
          />
          <label className="block mb-1">District</label>
          <input
            type="text"
            name="district"
            placeholder="District"
            value={createForm.district}
            onChange={(e) => handleInputChange(e, "create")}
            className="block w-full p-3 mb-4 bg-gray-800 border border-gray-600 rounded focus:ring focus:ring-yellow-500 outline-none"
          />
          <label className="block mb-1">Province</label>
          <input
            type="text"
            name="province"
            placeholder="Province"
            value={createForm.province}
            onChange={(e) => handleInputChange(e, "create")}
            className="block w-full p-3 mb-4 bg-gray-800 border border-gray-600 rounded focus:ring focus:ring-yellow-500 outline-none"
          />
          <label className="block mb-1">Postal Code</label>
          <input
            type="text"
            name="postalcode"
            placeholder="Postal Code"
            value={createForm.postalcode}
            onChange={(e) => handleInputChange(e, "create")}
            className="block w-full p-3 mb-4 bg-gray-800 border border-gray-600 rounded focus:ring focus:ring-yellow-500 outline-none"
          />
          <label className="block mb-1">Tel</label>
          <input
            type="text"
            name="tel"
            placeholder="Tel"
            value={createForm.tel}
            onChange={(e) => handleInputChange(e, "create")}
            className="block w-full p-3 mb-4 bg-gray-800 border border-gray-600 rounded focus:ring focus:ring-yellow-500 outline-none"
          />
          <label className="block mb-1">Picture URL</label>
          <input
            type="text"
            name="picture"
            placeholder="Picture URL"
            value={createForm.picture}
            onChange={(e) => handleInputChange(e, "create")}
            className="block w-full p-3 mb-4 bg-gray-800 border border-gray-600 rounded focus:ring focus:ring-yellow-500 outline-none"
          />
          <button
            onClick={handleSubmit}
            className="w-full p-3 bg-yellow-500 text-black font-semibold rounded hover:bg-yellow-600 transition-colors duration-300"
          >
            Create New Hotel
          </button>
        </div>
      </div>
    </div>
  );
}