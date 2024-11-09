import Link from "next/link";

export default function TopMenu() {
  return (
    <nav className="bg-black text-white py-4 flex justify-around">
      <Link href="/">Home</Link>
      <Link href="/mybooking">My Booking</Link>
      <Link href="/information">Information</Link>
      <Link href="/allbooking">All Booking</Link>
      <Link href="/profile">Profile</Link>
      <button className="ml-4">Sign-Out</button>
    </nav>
  );
}
