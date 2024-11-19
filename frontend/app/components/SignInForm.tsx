'use client';

import Link from "next/link";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function SignInForm() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");

    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(""); // Clear previous errors

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                setError(res.error); // Set the error message from the response
                return;
            }

            // Redirect to the homepage upon successful sign-in
            router.replace('/homepage');
        } catch (err) {
            setError("An unexpected error occurred. Please try again."); // General error message
        }
    };

    return (
        <div className="grid place-items-center h-screen bg-gray-100">
            <div className="relative shadow-lg p-5 rounded-lg border-t-4 border-cyan-400 bg-white text-black">
                <h1 className="text-xl font-bold my-4">Sign In</h1>
                <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                    <input
                        className="w-[400px] border border-gray-200 py-2 px-6 bg-zinc-100/40 rounded-lg"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <div className="relative">
                        <input
                            className="w-[400px] border border-gray-200 py-2 px-6 bg-zinc-100/40 rounded-lg"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 right-0 flex items-center px-3 focus:outline-none"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    <button
                        type="submit"
                        className="bg-cyan-600 text-white border-2 border-cyan-600 font-semibold py-2 px-2 rounded-lg transform transition-colors duration-300 hover:bg-white hover:text-cyan-600 cursor-pointer"
                    >
                        Sign In
                    </button>
                    {error && (
                        <div className="bg-red-500 text-white text-sm py-1 px-3 rounded">
                            {error}
                        </div>
                    )}
                    <Link href="/auth/register" className="text-sm mt-3 text-right">
                        Don't have an account?{" "}
                        <span className="underline text-cyan-700">Register Here!</span>
                    </Link>
                </form>
            </div>
        </div>
    );
}
