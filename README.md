# Roaring Kitty (React clone)

Frontend-only clone built with React 18, Vite and React Router. No backend:
accounts, balances, transactions and investments are stored in `localStorage`.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
```

Production build: `npm run build && npm run preview`.

## Notes
- Create an account on /signup, then sign in. Data is per browser.
- Passwords are stored in plain text in localStorage. Demo only.
- Reset everything: `localStorage.clear()` in the browser console.
