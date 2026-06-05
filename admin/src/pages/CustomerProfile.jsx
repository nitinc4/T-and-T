import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const CustomerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('bookings');

  useEffect(() => {
    fetchCustomerProfile();
  }, [id]);

  const fetchCustomerProfile = async () => {
    try {
      const { data } = await api.get(`/customers/${id}`);
      setCustomerData(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch customer details');
      setLoading(false);
    }
  };

  if (loading) return <div className="animate-fade-in"><h1 className="heading-1">Loading Profile...</h1></div>;
  if (error || !customerData) return <div className="animate-fade-in" style={{color: 'var(--color-danger)'}}>{error || 'Customer not found'}</div>;

  const { profile, bookings, payments } = customerData;

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => navigate('/customers')} style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--color-text)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>
          &larr; Back
        </button>
        <div>
          <h1 className="heading-1" style={{ margin: 0 }}>{profile.name}</h1>
          <p className="text-muted">{profile.mobileNumber} | {profile.email || 'No email'}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '2rem' }}>
        
        {/* Sidebar Info */}
        <div className="glass-card" style={{ height: 'fit-content' }}>
          <h3 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '1rem' }}>Profile Info</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Status</label>
              <div style={{ color: profile.isActive ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 600 }}>
                {profile.isActive ? 'Active' : 'Inactive'}
              </div>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Address</label>
              <div>{profile.address || 'N/A'}</div>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Joined Date</label>
              <div>{new Date(profile.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--glass-border)' }}>
            <button 
              onClick={() => setActiveTab('bookings')}
              style={{ flex: 1, padding: '1rem', background: activeTab === 'bookings' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', color: 'var(--color-text)', fontWeight: 600, cursor: 'pointer' }}>
              Booking History ({bookings.length})
            </button>
            <button 
              onClick={() => setActiveTab('payments')}
              style={{ flex: 1, padding: '1rem', background: activeTab === 'payments' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', color: 'var(--color-text)', fontWeight: 600, cursor: 'pointer' }}>
              Payment History ({payments.length})
            </button>
          </div>

          {/* Tab Content */}
          <div style={{ padding: '2rem' }}>
            {activeTab === 'bookings' && (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ color: 'var(--color-text-muted)', borderBottom: '1px solid var(--glass-border)' }}>
                    <th style={{ padding: '0.5rem' }}>Booking ID</th>
                    <th style={{ padding: '0.5rem' }}>Date</th>
                    <th style={{ padding: '0.5rem' }}>Route</th>
                    <th style={{ padding: '0.5rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length === 0 ? (
                    <tr><td colSpan="4" style={{ padding: '1rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No bookings found.</td></tr>
                  ) : (
                    bookings.map(b => (
                      <tr key={b._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                        <td style={{ padding: '1rem 0.5rem' }}>{b.bookingId}</td>
                        <td style={{ padding: '1rem 0.5rem' }}>{new Date(b.tripDate).toLocaleDateString()}</td>
                        <td style={{ padding: '1rem 0.5rem' }}>
                          <div style={{ fontSize: '0.875rem' }}>{b.pickupLocation}</div>
                          <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>to {b.dropLocation}</div>
                        </td>
                        <td style={{ padding: '1rem 0.5rem' }}>{b.bookingStatus}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {activeTab === 'payments' && (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ color: 'var(--color-text-muted)', borderBottom: '1px solid var(--glass-border)' }}>
                    <th style={{ padding: '0.5rem' }}>Booking ID</th>
                    <th style={{ padding: '0.5rem' }}>Date</th>
                    <th style={{ padding: '0.5rem' }}>Amount</th>
                    <th style={{ padding: '0.5rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.length === 0 ? (
                    <tr><td colSpan="4" style={{ padding: '1rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No payments found.</td></tr>
                  ) : (
                    payments.map((p, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                        <td style={{ padding: '1rem 0.5rem' }}>{p.bookingId}</td>
                        <td style={{ padding: '1rem 0.5rem' }}>{new Date(p.date).toLocaleDateString()}</td>
                        <td style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>₹{p.amount}</td>
                        <td style={{ padding: '1rem 0.5rem', color: p.status === 'Completed' ? 'var(--color-success)' : 'var(--color-warning)' }}>{p.status}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
