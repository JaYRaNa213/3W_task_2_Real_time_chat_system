import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

const STORAGE_KEY = 'chatflowUser';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Backward-compat migration: if old keys exist, convert them
    const legacyUsername = localStorage.getItem('username');
    const legacyGuest = localStorage.getItem('guest');
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    if (legacyUsername) {
      const migrated = { username: legacyUsername, isGuest: legacyGuest === 'true' };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
      // clean old keys
      localStorage.removeItem('username');
      localStorage.removeItem('guest');
      return migrated;
    }

    return null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = ({ username, token }) => setUser({ username, token, isGuest: false });
  const loginAsGuest = (username) => setUser({ username, isGuest: true });
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, setUser, login, loginAsGuest, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
