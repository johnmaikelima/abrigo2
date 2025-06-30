import { useSession } from 'next-auth/react';

type UserRole = 'admin' | 'editor' | 'author';

export interface UserSession {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: UserRole;
  };
  expires: string;
}

export function useUserSession() {
  const { data: session, status } = useSession() as { data: UserSession | null; status: string };
  
  return {
    session,
    status,
    isAuthenticated: status === 'authenticated',
    isAdmin: session?.user?.role === 'admin',
    isEditor: session?.user?.role === 'editor' || session?.user?.role === 'admin',
    isAuthor: session?.user?.role === 'author' || session?.user?.role === 'editor' || session?.user?.role === 'admin',
  };
}
