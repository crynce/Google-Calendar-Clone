
import { db } from "./client";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  doc,
  query,
  where,
} from "firebase/firestore";

export interface Event {
  id?: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  userId: string;
}

const EVENTS_COLLECTION = "events";

export const addEvent = (event: Event) => {
  return addDoc(collection(db, EVENTS_COLLECTION), event);
};

export const updateEvent = (id: string, event: Partial<Event>) => {
  const eventDoc = doc(db, EVENTS_COLLECTION, id);
  return updateDoc(eventDoc, event);
};

export const deleteEvent = (id: string) => {
  const eventDoc = doc(db, EVENTS_COLLECTION, id);
  return deleteDoc(eventDoc);
};

export const getEvents = (userId: string) => {
  const q = query(collection(db, EVENTS_COLLECTION), where("userId", "==", userId));
  return getDocs(q);
};
