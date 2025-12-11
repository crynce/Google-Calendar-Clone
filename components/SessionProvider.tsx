
'use client';

import { useEffect } from 'react';
import { SessionProvider as NextAuthProvider, useSession } from 'next-auth/react';
import useSessionStore from '@/stores/sessionStore';

const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const { updateSession } = useSessionStore();

  useEffect(() => {
    if (status === 'authenticated' && session) {
      updateSession(session);
    } else if (status === 'unauthenticated') {
      updateSession(null);
    }
  }, [session, status, updateSession]);

  return <>{children}</>;
};

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthProvider>
      <SessionProvider>{children}</SessionProvider>
    </NextAuthProvider>
  );
}
