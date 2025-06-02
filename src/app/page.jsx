"use client";

import { useContext } from "react";
import { AuthContext } from "./context";
import { useRouter } from "next/navigation";

export default function Home() {
  const { authToken, login } = useContext(AuthContext);
  const router = useRouter();

  const handleStart = async () => {
    if (!authToken && login) {
      const result = await login();
      if (result) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 text-gray-800 px-6 transition-all duration-700 ease-in-out">
      <div className="animate-fade-in-up text-center max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-6">
          Welcome to ChatterBox 💬
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-lg mx-auto whitespace-nowrap">
          Connect. Converse. Collaborate. Your chats, reimagined.
        </p>

        <button
          onClick={handleStart}
          className={`${
            authToken ? "bg-green-600 hover:bg-green-700 focus:ring-green-500" : "bg-purple-600 hover:bg-purple-700 focus:ring-purple-500"
          } focus:outline-none focus:ring-2 focus:ring-opacity-50 text-white font-semibold py-3 px-8 rounded-lg shadow-xl transition-all duration-300 transform hover:scale-105`}
          aria-label={authToken ? "Go to Dashboard" : "Start Chat"}
        >
          {authToken ? "Go to Dashboard" : "Get Started"}
        </button>
      </div>
    </div>
  );
}
