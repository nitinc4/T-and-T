import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Companies from './pages/Companies';
import Vehicles from './pages/Vehicles';
import Drivers from './pages/Drivers';
import Bookings from './pages/Bookings';
import Customers from './pages/Customers';
import CustomerProfile from './pages/CustomerProfile';
import AppBuilder from './pages/AppBuilder';
import './index.css';

// Placeholder Components
const Dashboard = () => (
  <div className="animate-fade-in">
    <h1 className="heading-1">Dashboard</h1>
    <p className="text-muted" style={{ marginBottom: '2rem' }}>Welcome to TravelPro SaaS Admin Panel</p>
    
    <div className="dashboard-grid">
      <div className="glass-card stat-card">
        <span className="stat-label">Total Companies</span>
        <span className="stat-value">1</span>
      </div>
      <div className="glass-card stat-card">
        <span className="stat-label">Active Subscriptions</span>
        <span className="stat-value">1</span>
      </div>
      <div className="glass-card stat-card">
        <span className="stat-label">Total Bookings</span>
        <span className="stat-value">0</span>
      </div>
      <div className="glass-card stat-card">
        <span className="stat-label">Monthly Revenue</span>
        <span className="stat-value">₹0</span>
      </div>
    </div>
  </div>
);

const Subscriptions = () => (
  <div className="animate-fade-in">
    <h1 className="heading-1">Subscriptions</h1>
    <p className="text-muted">View and manage billing plans.</p>
  </div>
);

const Settings = () => (
  <div className="animate-fade-in">
    <h1 className="heading-1">Settings</h1>
    <p className="text-muted">Platform configurations.</p>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) {
    return <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

const AdminLayout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="brand-title">TravelPro</div>
        </div>
        <ul className="nav-list">
          <li className="nav-item">
            <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Dashboard</NavLink>
          </li>
          
          {user?.role === 'SuperAdmin' && (
            <>
              <li className="nav-item">
                <NavLink to="/companies" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Companies</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/subscriptions" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Subscriptions</NavLink>
              </li>
            </>
          )}

          {user?.role === 'CompanyAdmin' && (
            <>
              <li className="nav-item">
                <NavLink to="/vehicles" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Vehicles</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/drivers" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Drivers</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/bookings" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Bookings</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/customers" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Customers</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/app-builder" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>App Builder</NavLink>
              </li>
            </>
          )}

          <li className="nav-item">
            <NavLink to="/settings" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Settings</NavLink>
          </li>
        </ul>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}></div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user?.name}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{user?.role}</span>
              </div>
            </div>
            <button 
              onClick={logout}
              style={{ background: 'transparent', border: '1px solid var(--color-border)', color: 'var(--color-text)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '0.75rem' }}
            >
              Sign Out
            </button>
          </div>
        </header>
        
        <div className="content-wrapper">
          {children}
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<ProtectedRoute><AdminLayout><Dashboard /></AdminLayout></ProtectedRoute>} />
          <Route path="/companies" element={<ProtectedRoute><AdminLayout><Companies /></AdminLayout></ProtectedRoute>} />
          <Route path="/subscriptions" element={<ProtectedRoute><AdminLayout><Subscriptions /></AdminLayout></ProtectedRoute>} />
          <Route path="/vehicles" element={<ProtectedRoute><AdminLayout><Vehicles /></AdminLayout></ProtectedRoute>} />
          <Route path="/drivers" element={<ProtectedRoute><AdminLayout><Drivers /></AdminLayout></ProtectedRoute>} />
          <Route path="/bookings" element={<ProtectedRoute><AdminLayout><Bookings /></AdminLayout></ProtectedRoute>} />
          <Route path="/customers" element={<ProtectedRoute><AdminLayout><Customers /></AdminLayout></ProtectedRoute>} />
          <Route path="/customers/:id" element={<ProtectedRoute><AdminLayout><CustomerProfile /></AdminLayout></ProtectedRoute>} />
          <Route path="/app-builder" element={<ProtectedRoute><AdminLayout><AppBuilder /></AdminLayout></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><AdminLayout><Settings /></AdminLayout></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
