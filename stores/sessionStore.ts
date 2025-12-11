import { create } from 'zustand';

interface SessionState {
  session: any;
  updateSession: (session: any) => void;
}

const useSessionStore = create<SessionState>((set) => ({
  session: null,
  updateSession: (session) => set({ session }),
}));

export default useSessionStore;