"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { getSession } from "@/app/utils/session";
import TopMenu from "@/app/components/TopMenu";
import { useRouter } from "next/navigation";
import Image from "next/image";

import {
  fetchHotels,
  createHotel,
  deleteHotel,
  updateHotel,
} from "@/app/services/hotelService";
import { Hotel } from "../interface";
import { FaEdit, FaSearch, FaTrash } from "react-icons/fa";
import { createBooking } from "@/app/services/bookingService";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useTheme } from "../ThemeProvider";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import { getUserInfo } from "../services/authService";

interface FormState {
  name: string;
  address: string;
  district: string;
  province: string;
  postalcode: string;
  tel: string;
  picture: string;
}

interface Session {
  _id: string;
  name: string;
  email: string;
  token: string;
}

interface UserInfo {
  data: {
    role: string;
    name: string;
    email: string;
    // [key: string]: any; // If there are other unknown fields
  };
}

export default function Home() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const { isDarkMode } = useTheme();
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
  const [session, setSession] = useState<Session | null>(null); // Add state to track session
  const router = useRouter();

  useEffect(() => {
    const currentSession = getSession(); // Retrieve session from cookies
    if (currentSession) {
      setSession(currentSession); // Set session state
      console.log("Session retrieved:", currentSession); // Log session here
    } else {
      router.push("/auth/login"); // Redirect to login if session is missing
    }
  }, []);

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const user = await getUserInfo();
        setUserInfo(user); // Set user information
        console.log("User Info:", user); // Debugging
      } catch (err) {
        console.error(err); // Logs the error for debugging purposes
      }
    }

    fetchUserInfo();
  }, []);

  // const handleLogout = () => {
  //   clearSession(); // Clear session from cookies
  //   setSession(null); // Reset session state
  //   router.push("auth/login"); // Redirect to login page
  // };

  const [isEditing, setIsEditing] = useState(false);
  const [currentHotelId, setCurrentHotelId] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

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
    console.log(session);
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
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-black text-white" : "bg-white text-black"
      } transition-colors duration-300`}
    >
      <TopMenu />
      {isBooking && (
        <Dialog
          open={isBooking}
          onClose={() => setIsBooking(false)}
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
            Book a Hotel
          </DialogTitle>
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
                  InputLabelProps={{
                    shrink: true,
                    style: {
                      color: isDarkMode ? "#ffffff" : "#000000",
                    },
                  }}
                  InputProps={{
                    inputProps: {
                      min: bookingDates.bookingDate
                        ? bookingDates.bookingDate.format("YYYY-MM-DD")
                        : undefined,
                    },
                    style: {
                      backgroundColor: isDarkMode ? "#374151" : "#f9fafb",
                      color: isDarkMode ? "#ffffff" : "#000000",
                    },
                  }}
                />
              </div>
            </LocalizationProvider>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setIsBooking(false)}
              style={{
                color: isDarkMode ? "#9ca3af" : "#000000",
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleBookingSubmit}
              style={{
                color: isDarkMode ? "#ffffff" : "#ffffff",
                backgroundColor: isDarkMode ? "#2563eb" : "#3b82f6",
              }}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`p-6 rounded-lg shadow-lg w-full max-w-lg ${
              isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"
            }`}
          >
            <h2
              className={`text-2xl font-bold mb-4 ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              Edit Hotel
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Hotel Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Hotel Name"
                  value={editForm.name}
                  onChange={(e) => handleInputChange(e, "edit")}
                  className={`block w-full p-3 rounded border focus:ring focus:ring-yellow-500 outline-none ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-600 text-white"
                      : "bg-gray-100 border-gray-300 text-black"
                  }`}
                />
              </div>
              <div>
                <label className="block mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={editForm.address}
                  onChange={(e) => handleInputChange(e, "edit")}
                  className={`block w-full p-3 rounded border focus:ring focus:ring-yellow-500 outline-none ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-600 text-white"
                      : "bg-gray-100 border-gray-300 text-black"
                  }`}
                />
              </div>
              <div>
                <label className="block mb-1">District</label>
                <input
                  type="text"
                  name="district"
                  placeholder="District"
                  value={editForm.district}
                  onChange={(e) => handleInputChange(e, "edit")}
                  className={`block w-full p-3 rounded border focus:ring focus:ring-yellow-500 outline-none ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-600 text-white"
                      : "bg-gray-100 border-gray-300 text-black"
                  }`}
                />
              </div>
              <div>
                <label className="block mb-1">Province</label>
                <input
                  type="text"
                  name="province"
                  placeholder="Province"
                  value={editForm.province}
                  onChange={(e) => handleInputChange(e, "edit")}
                  className={`block w-full p-3 rounded border focus:ring focus:ring-yellow-500 outline-none ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-600 text-white"
                      : "bg-gray-100 border-gray-300 text-black"
                  }`}
                />
              </div>
              <div>
                <label className="block mb-1">Postal Code</label>
                <input
                  type="text"
                  name="postalcode"
                  placeholder="Postal Code"
                  value={editForm.postalcode}
                  onChange={(e) => handleInputChange(e, "edit")}
                  className={`block w-full p-3 rounded border focus:ring focus:ring-yellow-500 outline-none ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-600 text-white"
                      : "bg-gray-100 border-gray-300 text-black"
                  }`}
                />
              </div>
              <div>
                <label className="block mb-1">Tel</label>
                <input
                  type="text"
                  name="tel"
                  placeholder="Tel"
                  value={editForm.tel}
                  onChange={(e) => handleInputChange(e, "edit")}
                  className={`block w-full p-3 rounded border focus:ring focus:ring-yellow-500 outline-none ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-600 text-white"
                      : "bg-gray-100 border-gray-300 text-black"
                  }`}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-1">Picture URL</label>
                <input
                  type="text"
                  name="picture"
                  placeholder="Picture URL"
                  value={editForm.picture}
                  onChange={(e) => handleInputChange(e, "edit")}
                  className={`block w-full p-3 rounded border focus:ring focus:ring-yellow-500 outline-none ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-600 text-white"
                      : "bg-gray-100 border-gray-300 text-black"
                  }`}
                />
              </div>
            </div>
            <button
              onClick={handleEditSubmit}
              className={`w-full p-3 mt-4 font-semibold rounded hover:bg-blue-600 transition-colors duration-300 ${
                isDarkMode ? "bg-blue-500 text-white" : "bg-blue-500 text-white"
              }`}
            >
              Save Changes
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className={`w-full p-3 mt-4 font-semibold rounded transition-colors duration-300 ${
                isDarkMode
                  ? "bg-gray-700 hover:bg-gray-800 text-white"
                  : "bg-gray-300 hover:bg-gray-400 text-black"
              }`}
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
        <div className="max-w-lg mx-auto mb-8">
          <div
            className={`flex items-center border rounded-lg p-2 ${
              isDarkMode
                ? "bg-gray-800 border-gray-600 text-white"
                : "bg-gray-100 border-gray-300 text-black"
            }`}
          >
            <input
              type="text"
              placeholder="Search hotels..."
              value={searchTerm}
              onChange={handleSearchChange}
              className={`flex-grow bg-transparent outline-none px-2 ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            />
            <FaSearch
            // className={`${isDarkMode ? "text-white" : "text-black"}`}
            />
          </div>
        </div>

        <div className="flex flex-wrap -mx-4">
          {hotels
            .filter((hotel) =>
              hotel.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((hotel) => (
              <div
                key={hotel.id}
                className="w-full md:w-1/2 lg:w-1/3 px-4 mb-8"
              >
                <div
                  className={`shadow-lg relative rounded-lg overflow-hidden ${
                    isDarkMode
                      ? "bg-gray-800 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  <Image
                    src="https://picsum.photos/1280/720/?hotel%20lobby"
                    alt={`${hotel.name} Image`}
                    className="w-full h-48 object-cover rounded-t-lg mb-4"
                  />
                  <div className="p-4">
                    <h2
                      className={`text-2xl font-semibold mb-2 ${
                        isDarkMode ? "text-white" : "text-black"
                      }`}
                    >
                      {hotel.name}
                    </h2>
                    <p
                      className={`${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Address: {hotel.address}
                    </p>
                    <p
                      className={`${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      District: {hotel.district}
                    </p>
                    <p
                      className={`${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Province: {hotel.province}
                    </p>
                    <p
                      className={`${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Tel: {hotel.tel}
                    </p>
                    {userInfo?.data.role == "admin" && (
                      <>
                        <div className="absolute top-2 right-2 flex space-x-2">
                          <button
                            onClick={() => handleEditClick(hotel)}
                            className={`p-2 rounded-full focus:outline-none ${
                              isDarkMode
                                ? "bg-yellow-700 hover:bg-yellow-600 text-white"
                                : "bg-yellow-300 hover:bg-yellow-400 text-black"
                            }`}
                            aria-label="Edit Hotel"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(hotel.id)}
                            className={`p-2 rounded-full focus:outline-none ${
                              isDarkMode
                                ? "bg-red-700 hover:bg-red-600 text-white"
                                : "bg-red-300 hover:bg-red-400 text-black"
                            }`}
                            aria-label="Delete Hotel"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </>
                    )}

                    <button
                      onClick={() => handleBookingClick(hotel.id)}
                      className="mt-4 w-full p-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
                    >
                      Book
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {userInfo?.data.role == "admin" && (
          <>
            <h1
              className={`text-3xl font-bold mt-16 text-center ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              Create a New Hotel
            </h1>
            <div
              className={`max-w-lg mx-auto mt-4 p-6 rounded-lg shadow-lg ${
                isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"
              }`}
            >
              <label className="block mb-1">Hotel Name</label>
              <input
                type="text"
                name="name"
                placeholder="Hotel Name"
                value={createForm.name}
                onChange={(e) => handleInputChange(e, "create")}
                className={`block w-full p-3 mb-4 rounded border focus:ring focus:ring-yellow-500 outline-none ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-600 text-white"
                    : "bg-gray-100 border-gray-300 text-black"
                }`}
              />
              <label className="block mb-1">Address</label>
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={createForm.address}
                onChange={(e) => handleInputChange(e, "create")}
                className={`block w-full p-3 mb-4 rounded border focus:ring focus:ring-yellow-500 outline-none ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-600 text-white"
                    : "bg-gray-100 border-gray-300 text-black"
                }`}
              />
              <label className="block mb-1">District</label>
              <input
                type="text"
                name="district"
                placeholder="District"
                value={createForm.district}
                onChange={(e) => handleInputChange(e, "create")}
                className={`block w-full p-3 mb-4 rounded border focus:ring focus:ring-yellow-500 outline-none ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-600 text-white"
                    : "bg-gray-100 border-gray-300 text-black"
                }`}
              />
              <label className="block mb-1">Province</label>
              <input
                type="text"
                name="province"
                placeholder="Province"
                value={createForm.province}
                onChange={(e) => handleInputChange(e, "create")}
                className={`block w-full p-3 mb-4 rounded border focus:ring focus:ring-yellow-500 outline-none ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-600 text-white"
                    : "bg-gray-100 border-gray-300 text-black"
                }`}
              />
              <label className="block mb-1">Postal Code</label>
              <input
                type="text"
                name="postalcode"
                placeholder="Postal Code"
                value={createForm.postalcode}
                onChange={(e) => handleInputChange(e, "create")}
                className={`block w-full p-3 mb-4 rounded border focus:ring focus:ring-yellow-500 outline-none ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-600 text-white"
                    : "bg-gray-100 border-gray-300 text-black"
                }`}
              />
              <label className="block mb-1">Tel</label>
              <input
                type="text"
                name="tel"
                placeholder="Tel"
                value={createForm.tel}
                onChange={(e) => handleInputChange(e, "create")}
                className={`block w-full p-3 mb-4 rounded border focus:ring focus:ring-yellow-500 outline-none ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-600 text-white"
                    : "bg-gray-100 border-gray-300 text-black"
                }`}
              />
              <label className="block mb-1">Picture URL</label>
              <input
                type="text"
                name="picture"
                placeholder="Picture URL"
                value={createForm.picture}
                onChange={(e) => handleInputChange(e, "create")}
                className={`block w-full p-3 mb-4 rounded border focus:ring focus:ring-yellow-500 outline-none ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-600 text-white"
                    : "bg-gray-100 border-gray-300 text-black"
                }`}
              />
              <button
                onClick={handleSubmit}
                className={`w-full p-3 font-semibold rounded hover:bg-blue-600 transition-colors duration-300 ${
                  isDarkMode
                    ? "bg-blue-500 text-white"
                    : "bg-blue-500 text-white"
                }`}
              >
                Create New Hotel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
