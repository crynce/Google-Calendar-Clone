
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase/client";
import { signOut } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md">
      <h1 className="text-2xl font-bold text-gray-900">
        <Link href="/">Calendar App</Link>
      </h1>
      <nav>
        {loading ? (
          <div>Loading...</div>
        ) : user ? (
          <div className="flex items-center space-x-4">
            <p className="text-gray-700">Welcome, {user.email}</p>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Sign Up
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
