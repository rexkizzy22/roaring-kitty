import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AccountSettings from './pages/AccountSettings.jsx';
import FundAccount from './pages/FundAccount.jsx';
import WithdrawFunds from './pages/WithdrawFunds.jsx';
import Transactions from './pages/Transactions.jsx';
import Investment from './pages/Investment.jsx';
import Kyc from './pages/Kyc.jsx';
import ReturnsHistory from './pages/ReturnsHistory.jsx';
import { investments } from './investments.js';

function Protected({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}
function Guest({ children }) {
  const { user } = useAuth();
  return user ? <Navigate to="/" replace /> : children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Guest><Login /></Guest>} />
      <Route path="/signup" element={<Guest><Signup /></Guest>} />
      <Route element={<Protected><Layout /></Protected>}>
        <Route index element={<Dashboard />} />
        <Route path="account-settings" element={<AccountSettings />} />
        <Route path="kyc" element={<Kyc />} />
        <Route path="fund-account" element={<FundAccount />} />
        <Route path="withdraw" element={<WithdrawFunds />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="returns-history" element={<ReturnsHistory />} />
        {Object.values(investments).map((cfg) => (
          <Route key={cfg.path} path={cfg.path} element={<Investment cfg={cfg} />} />
        ))}
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
