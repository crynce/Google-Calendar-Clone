
"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import Calendar from "@/components/calendar/Calendar";
import { FiCalendar, FiLogIn } from "react-icons/fi";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-6 py-12">
      {user ? (
        <Calendar />
      ) : (
        <div className="text-center py-16">
          <FiCalendar className="mx-auto text-6xl text-indigo-600 mb-6" />
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
            Organize Your Life with Our Calendar
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            A simple and intuitive calendar to manage your events and stay on top
            of your schedule.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-transform duration-300 transform hover:scale-105"
          >
            <FiLogIn />
            <span>Get Started</span>
          </Link>
        </div>
      )}
    </main>
  );
}
