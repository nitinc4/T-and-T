import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '', mobileNumber: '', email: '', address: ''
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const { data } = await api.get('/customers');
      setCustomers(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch customers');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    try {
      await api.post('/customers', formData);
      setShowModal(false);
      setFormData({ name: '', mobileNumber: '', email: '', address: '' });
      setLoading(true);
      fetchCustomers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add customer');
    }
  };

  if (loading) return <div className="animate-fade-in"><h1 className="heading-1">Loading...</h1></div>;
  if (error) return <div className="animate-fade-in" style={{color: 'var(--color-danger)'}}>{error}</div>;

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="heading-1">Customers</h1>
          <p className="text-muted">Manage your customer profiles and view their booking history.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', fontWeight: '600', cursor: 'pointer' }}>
          + Add Customer
        </button>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 className="heading-2" style={{ margin: 0 }}>Add New Customer</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--color-text)', cursor: 'pointer', fontSize: '1.5rem' }}>&times;</button>
            </div>
            <form onSubmit={handleAddCustomer} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input type="text" name="name" placeholder="Customer Name" required value={formData.name} onChange={handleInputChange} className="modal-input" />
              <input type="text" name="mobileNumber" placeholder="Mobile Number" required value={formData.mobileNumber} onChange={handleInputChange} className="modal-input" />
              <input type="email" name="email" placeholder="Email (Optional)" value={formData.email} onChange={handleInputChange} className="modal-input" />
              <input type="text" name="address" placeholder="Home Address (Optional)" value={formData.address} onChange={handleInputChange} className="modal-input" />
              
              <button type="submit" style={{ background: 'var(--color-primary)', color: 'white', border: 'none', padding: '0.875rem', borderRadius: 'var(--radius-md)', fontWeight: '600', cursor: 'pointer', marginTop: '1rem' }}>
                Save Customer
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255, 255, 255, 0.05)', borderBottom: '1px solid var(--glass-border)' }}>
              <th style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>Customer Info</th>
              <th style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>Contact</th>
              <th style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>Status</th>
              <th style={{ padding: '1rem', color: 'var(--color-text-muted)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No customers found.</td></tr>
            ) : (
              customers.map((c) => (
                <tr key={c._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 600 }}>{c.name}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Joined: {new Date(c.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                    <div>{c.mobileNumber}</div>
                    <div style={{color:'var(--color-text-muted)'}}>{c.email || 'No email'}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, background: c.isActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(100, 116, 139, 0.2)', color: c.isActive ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
                      {c.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                     <button 
                       onClick={() => navigate(`/customers/${c._id}`)}
                       style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)', color: 'var(--color-text)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '0.875rem' }}>
                       View Profile
                     </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;
