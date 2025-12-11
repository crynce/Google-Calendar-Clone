
'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiUserPlus, FiMail, FiLock, FiUser } from 'react-icons/fi';

const RegisterPage = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('All fields are necessary.');
      return;
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        router.push('/login');
      } else {
        const { message } = await res.json();
        setError(message);
      }
    } catch (error) {
      setError('Something went wrong.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg">
        <div className="text-center">
          <FiUserPlus className="mx-auto text-5xl text-blue-600 mb-4" />
          <h1 className="text-4xl font-extrabold text-gray-900">Create an Account</h1>
          <p className="text-lg text-gray-600">Join us and start organizing your life.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
            <FiUser className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
            />
          </div>
          <div className="relative">
            <FiMail className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
            />
          </div>
          <div className="relative">
            <FiLock className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
            />
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300"
          >
            <FiUserPlus />
            <span>Register</span>
          </button>
          {error && <p className="text-sm text-red-500 mt-4 text-center">{error}</p>}
        </form>
        <p className="text-center text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
