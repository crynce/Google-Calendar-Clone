
"use client";

import { useState, useEffect } from "react";
import { Event } from "@/lib/firebase/firestore";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string) => void;
  onDelete: (id: string) => void;
  event: Event | null;
}

export default function EventModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  event,
}: EventModalProps) {
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (event) {
      setTitle(event.title);
    } else {
      setTitle("");
    }
  }, [event]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-xl font-bold">
          {event ? "Edit Event" : "Add Event"}
        </h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md"
        />
        <div className="flex justify-end space-x-4">
          {event && (
            <button
              onClick={() => onDelete(event.id!)}
              className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(title)}
            className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
