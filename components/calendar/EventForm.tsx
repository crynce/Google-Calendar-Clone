
'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiPlusCircle, FiCalendar, FiClock, FiTag } from 'react-icons/fi';

const EventForm = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title || !date || !startTime || !endTime) {
      setError('All fields are necessary.');
      return;
    }

    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, date, startTime, endTime }),
      });

      if (res.ok) {
        router.refresh();
        setTitle('');
        setDate('');
        setStartTime('');
        setEndTime('');
      } else {
        const { message } = await res.json();
        setError(message);
      }
    } catch (error) {
      setError('Something went wrong.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <FiTag className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Event Title"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
          />
        </div>
        <div className="relative">
          <FiCalendar className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
                <FiClock className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                <input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
                />
            </div>
            <div className="relative">
                <FiClock className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                <input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
                />
            </div>
        </div>
        <button
          type="submit"
          className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300"
        >
          <FiPlusCircle />
          <span>Add Event</span>
        </button>
        {error && <p className="text-sm text-red-500 mt-4 text-center">{error}</p>}
      </form>
    </div>
  );
};

export default EventForm;
