import { createContext, useCallback, useContext, useState } from 'react';
import {
  clearSession,
  getSessionId,
  getUserById,
  loginUser,
  registerUser,
  setSessionId,
  uid,
  updateUserRecord,
} from './storage.js';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const id = getSessionId();
    return id ? getUserById(id) : null;
  });

  const login = useCallback((identifier, password) => {
    const u = loginUser(identifier, password);
    setSessionId(u.id);
    setUser(u);
  }, []);

  const signup = useCallback((data) => {
    const u = registerUser(data);
    setSessionId(u.id);
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const update = useCallback(
    (updater) => {
      if (!user) return null;
      const next = updateUserRecord(user.id, updater);
      setUser(next);
      return next;
    },
    [user]
  );

  const addTransaction = useCallback(
    (tx) =>
      update((u) => ({
        ...u,
        transactions: [
          { id: uid(), date: new Date().toISOString(), status: 'Completed', ...tx },
          ...u.transactions,
        ],
      })),
    [update]
  );

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, update, addTransaction }}>
      {children}
    </AuthContext.Provider>
  );
}
