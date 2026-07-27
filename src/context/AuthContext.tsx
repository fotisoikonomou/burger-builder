import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { login as apiLogin } from '../api/auth';
import { TOKEN_TTL_MS } from '../api/config';

interface StoredSession {
  token: string;
  expiresAt: number;
}

interface AuthContextValue {
  token: string | null;
  isAuthenticated: boolean;
  /** Set when the user was logged out automatically (token TTL / 401). */
  sessionMessage: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: (message?: string) => void;
}

const SESSION_KEY = 'burger-builder.session';
const SESSION_EXPIRED_MESSAGE =
  'Your session expired (tokens last 10 minutes). Please log in again.';

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredSession(): StoredSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as StoredSession;
    if (typeof session.token !== 'string' || typeof session.expiresAt !== 'number') {
      return null;
    }
    return session.expiresAt > Date.now() ? session : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<StoredSession | null>(readStoredSession);
  const [sessionMessage, setSessionMessage] = useState<string | null>(null);
  const expiryTimer = useRef<number | undefined>(undefined);

  const logout = useCallback((message?: string) => {
    sessionStorage.removeItem(SESSION_KEY);
    setSession(null);
    setSessionMessage(message ?? null);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const { token } = await apiLogin(username, password);
    const next: StoredSession = { token, expiresAt: Date.now() + TOKEN_TTL_MS };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(next));
    setSession(next);
    setSessionMessage(null);
  }, []);

  // Log the user out automatically the moment the token reaches its TTL,
  // instead of letting the next request fail with a 401.
  useEffect(() => {
    window.clearTimeout(expiryTimer.current);
    if (!session) return;

    const remaining = session.expiresAt - Date.now();
    expiryTimer.current = window.setTimeout(
      () => logout(SESSION_EXPIRED_MESSAGE),
      Math.max(remaining, 0),
    );
    return () => window.clearTimeout(expiryTimer.current);
  }, [session, logout]);

  const value = useMemo<AuthContextValue>(
    () => ({
      token: session?.token ?? null,
      isAuthenticated: session !== null,
      sessionMessage,
      login,
      logout,
    }),
    [session, sessionMessage, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

export { SESSION_EXPIRED_MESSAGE };
