import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import api from '../api/axios';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/reports');
      setStats(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch dashboard stats');
      setLoading(false);
    }
  };

  if (loading) return <div className="animate-fade-in"><h1 className="heading-1">Loading Dashboard...</h1></div>;
  if (error) return <div className="animate-fade-in" style={{color: 'var(--color-danger)'}}>{error}</div>;

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="heading-1">Dashboard</h1>
        <p className="text-muted">Overview of your business performance.</p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-card">
          <h3 style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Total Revenue</h3>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>₹{stats.totalRevenue.toLocaleString()}</div>
        </div>
        <div className="glass-card">
          <h3 style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Total Bookings</h3>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalBookings}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-success)', marginTop: '0.5rem' }}>{stats.completedBookings} Completed</div>
        </div>
        <div className="glass-card">
          <h3 style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Available Vehicles</h3>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.vehicleStats.available} / {stats.vehicleStats.total}</div>
        </div>
        <div className="glass-card">
          <h3 style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Available Drivers</h3>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.driverStats.available} / {stats.driverStats.total}</div>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-card">
          <h2 className="heading-2" style={{ marginBottom: '1.5rem' }}>Revenue Trend (Last 6 Months)</h2>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="name" stroke="var(--color-text-muted)" fontSize={12} />
                <YAxis stroke="var(--color-text-muted)" fontSize={12} />
                <Tooltip 
                  contentStyle={{ background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: 'var(--color-primary)', fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card">
          <h2 className="heading-2" style={{ marginBottom: '1.5rem' }}>Bookings Status Overview</h2>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Pending', count: stats.pendingBookings, fill: '#f59e0b' },
                { name: 'Completed', count: stats.completedBookings, fill: '#10b981' },
                { name: 'Other', count: stats.totalBookings - stats.pendingBookings - stats.completedBookings, fill: '#6b7280' }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="name" stroke="var(--color-text-muted)" fontSize={12} />
                <YAxis stroke="var(--color-text-muted)" fontSize={12} allowDecimals={false} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
