// All data lives in localStorage. There is no backend.
// NOTE: passwords are stored in plain text because this is a demo clone only.
const USERS = 'rk_users';
const SESSION = 'rk_session';

const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

export const getUsers = () => read(USERS, []);
export const saveUsers = (users) => write(USERS, users);
export const getSessionId = () => read(SESSION, null);
export const setSessionId = (id) => write(SESSION, id);
export const clearSession = () => localStorage.removeItem(SESSION);
export const getUserById = (id) => getUsers().find((u) => u.id === id) || null;

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export function registerUser({ name, username, email, password }) {
  const users = getUsers();
  if (users.some((u) => u.username.toLowerCase() === username.toLowerCase()))
    throw new Error('That username is already taken.');
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase()))
    throw new Error('An account with this email already exists.');
  const user = {
    id: uid(),
    name,
    username,
    email,
    password,
    createdAt: new Date().toISOString(),
    balance: 0,
    profit: 0,
    bonus: 0,
    kyc: { status: 'unverified' },
    transactions: [],
    investments: [],
    phone: '',
    country: '',
  };
  saveUsers([...users, user]);
  return user;
}

export function loginUser(identifier, password) {
  const id = identifier.trim().toLowerCase();
  const user = getUsers().find(
    (u) => u.username.toLowerCase() === id || u.email.toLowerCase() === id
  );
  if (!user || user.password !== password) throw new Error('Invalid username/email or password.');
  return user;
}

export function updateUserRecord(id, updater) {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  users[idx] = updater({ ...users[idx] });
  saveUsers(users);
  return users[idx];
}
