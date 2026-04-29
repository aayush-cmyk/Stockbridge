import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import SupplierDashboard from './pages/SupplierDashboard';
import RetailerDashboard from './pages/RetailerDashboard';
import Features from './pages/Features';
import HowItWorks from './pages/HowItWorks';
import Pricing from './pages/Pricing';
import { useState, useEffect } from 'react';

const PrivateRoute = ({ children, roleRequired }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) return <Navigate to="/login" />;
  if (roleRequired && role !== roleRequired) {
    return role === 'supplier' ? <Navigate to="/supplier" /> : <Navigate to="/retailer" />;
  }
  return children;
};

function App() {
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setAuth(true);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/features" element={<Features />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Supplier Routes */}
        <Route 
          path="/supplier/*" 
          element={
            <PrivateRoute roleRequired="supplier">
              <SupplierDashboard />
            </PrivateRoute>
          } 
        />
        
        {/* Retailer Routes */}
        <Route 
          path="/retailer/*" 
          element={
            <PrivateRoute roleRequired="retailer">
              <RetailerDashboard />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
