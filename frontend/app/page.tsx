"use client";

import { useEffect, useState, ChangeEvent } from "react";
import TopMenu from "@/app/components/TopMenu";
import { fetchHotels, createHotel } from "@/app/services/hotelService";
import { Hotel } from "./interface";
import { ThemeProvider } from "./ThemeProvider";

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
  const [form, setForm] = useState<FormState>({
    name: "",
    address: "",
    district: "",
    province: "",
    postalcode: "",
    tel: "",
    picture: "",
  });

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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      // Assuming createHotel function takes a FormState object and sends a POST request
      await createHotel(form);
      alert("Hotel created successfully!");
    } catch (error) {
      console.error("Failed to create hotel:", error);
    }
  };

  return (
    <ThemeProvider>
      <div className="bg-black text-white min-h-screen">
        <TopMenu />
        <div className="p-8">
          <h1 className="text-4xl font-extrabold mb-8 text-center">
            Explore Our Hotels
          </h1>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {hotels.map((hotel) => (
              <div
                key={hotel.id}
                className="p-4 bg-gray-800 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
              >
                <h2 className="text-2xl font-semibold mb-2">{hotel.name}</h2>
                <p className="text-gray-300">Address: {hotel.address}</p>
                <p className="text-gray-300">District: {hotel.district}</p>
                <p className="text-gray-300">Province: {hotel.province}</p>
                <p className="text-gray-300">Tel: {hotel.tel}</p>
              </div>
            ))}
          </div>

          <h1 className="text-3xl font-bold mt-16 text-center">
            Create a New Hotel
          </h1>
          <div className="max-w-lg mx-auto mt-4 p-6 bg-gray-900 rounded-lg shadow-lg">
            <input
              type="text"
              name="name"
              placeholder="Hotel Name"
              value={form.name}
              onChange={handleInputChange}
              className="block w-full p-3 mb-4 bg-gray-800 border border-gray-600 rounded focus:ring focus:ring-yellow-500 outline-none"
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleInputChange}
              className="block w-full p-3 mb-4 bg-gray-800 border border-gray-600 rounded focus:ring focus:ring-yellow-500 outline-none"
            />
            <input
              type="text"
              name="district"
              placeholder="District"
              value={form.district}
              onChange={handleInputChange}
              className="block w-full p-3 mb-4 bg-gray-800 border border-gray-600 rounded focus:ring focus:ring-yellow-500 outline-none"
            />
            <input
              type="text"
              name="province"
              placeholder="Province"
              value={form.province}
              onChange={handleInputChange}
              className="block w-full p-3 mb-4 bg-gray-800 border border-gray-600 rounded focus:ring focus:ring-yellow-500 outline-none"
            />
            <input
              type="text"
              name="postalcode"
              placeholder="Postal Code"
              value={form.postalcode}
              onChange={handleInputChange}
              className="block w-full p-3 mb-4 bg-gray-800 border border-gray-600 rounded focus:ring focus:ring-yellow-500 outline-none"
            />
            <input
              type="text"
              name="tel"
              placeholder="Tel"
              value={form.tel}
              onChange={handleInputChange}
              className="block w-full p-3 mb-4 bg-gray-800 border border-gray-600 rounded focus:ring focus:ring-yellow-500 outline-none"
            />
            <input
              type="text"
              name="picture"
              placeholder="Picture URL"
              value={form.picture}
              onChange={handleInputChange}
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
    </ThemeProvider>
  );
}
