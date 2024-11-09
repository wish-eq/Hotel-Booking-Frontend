'use client'
import Image from "next/image";
import styles from "@/styles/FontPage.module.css"
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function HomePage() {
    const [index, setIndex] = useState(0);
    const router = useRouter();
    useEffect(() => {
        const timer = setTimeout(() => {
            setIndex(index + 1);
        }, 3000);

        return () => clearTimeout(timer);
    }, [index]);


    const { data: session } = useSession();

    return (
        <div className={`${styles.allFont} flex justify-center items-center 
        relative w-screen h-screen text-white`}>
            <Image src="/images/background.avif"
                className="blur-sm saturate-100 opacity-60"
                alt="Error For Load Home Background"
                fill={true} />

            <div className="relative">
                <div className=" flex flex-row justify-center">
                    <h1 className="text-[80px]">HOTEL BOOKING</h1>
                </div>
                <div className={`${styles.allFont} flex flex-row justify-center text-[30px] 
                mt-[-20px] items-center`}>
                    <span className="mb-[22px] mr-[10px]">__</span>
                    <span>asfafadfafa</span>
                    <span className="mb-[22px] ml-[10px]">__</span>
                </div>
                <div className="text-white font-medium text-[30px] text-center pt-4 relative">
                    {session ? (
                        <span>Welcome {session.user?.name} to our website !</span>
                    ) : (
                        <div className="flex flex-col space-y-3">
                            <p>Please sign in to our website to see our amazing contents !</p>
                            <button
                                className="bg-slate-950 text-gray-300 border-2 border-white border-opacity-100
          font-semibold py-2 px-2 rounded-lg transition-colors duration-300 hover:bg-black 
          hover:text-white hover:border-transparent"
                                onClick={() => {
                                    router.push("/auth/signin");
                                }}
                            >
                                Sign In / Register Here !
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}