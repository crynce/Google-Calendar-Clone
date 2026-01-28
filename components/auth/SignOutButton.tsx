"use client";

import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

export default function SignOutButton() {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors duration-300"
    >
      Sign Out
    </button>
  );
}
