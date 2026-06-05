import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', licenseNumber: '', licenseExpiry: '', address: ''
  });

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const { data } = await api.get('/drivers');
      setDrivers(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch drivers');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddDriver = async (e) => {
    e.preventDefault();
    try {
      await api.post('/drivers', formData);
      setShowModal(false);
      setFormData({ name: '', email: '', password: '', licenseNumber: '', licenseExpiry: '', address: '' });
      setLoading(true);
      fetchDrivers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add driver');
    }
  };

  if (loading) return <div className="animate-fade-in"><h1 className="heading-1">Loading...</h1></div>;
  if (error) return <div className="animate-fade-in" style={{color: 'var(--color-danger)'}}>{error}</div>;

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="heading-1">Drivers</h1>
          <p className="text-muted">Manage your drivers and their credentials.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', fontWeight: '600', cursor: 'pointer' }}>
          + Add Driver
        </button>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 className="heading-2" style={{ margin: 0 }}>Add New Driver</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--color-text)', cursor: 'pointer', fontSize: '1.5rem' }}>&times;</button>
            </div>
            <form onSubmit={handleAddDriver} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input type="text" name="name" placeholder="Driver Name" required value={formData.name} onChange={handleInputChange} className="modal-input" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input type="email" name="email" placeholder="Email (For app login)" required value={formData.email} onChange={handleInputChange} className="modal-input" />
                <input type="password" name="password" placeholder="Temporary Password" required value={formData.password} onChange={handleInputChange} className="modal-input" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                <input type="text" name="licenseNumber" placeholder="License Number" required value={formData.licenseNumber} onChange={handleInputChange} className="modal-input" />
                <div style={{display:'flex', flexDirection:'column', gap:'0.5rem'}}>
                  <label style={{fontSize: '0.8rem', color: 'var(--color-text-muted)'}}>License Expiry</label>
                  <input type="date" name="licenseExpiry" required value={formData.licenseExpiry} onChange={handleInputChange} className="modal-input" />
                </div>
              </div>
              <input type="text" name="address" placeholder="Home Address" value={formData.address} onChange={handleInputChange} className="modal-input" />
              
              <button type="submit" style={{ background: 'var(--color-primary)', color: 'white', border: 'none', padding: '0.875rem', borderRadius: 'var(--radius-md)', fontWeight: '600', cursor: 'pointer', marginTop: '1rem' }}>
                Save Driver
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255, 255, 255, 0.05)', borderBottom: '1px solid var(--glass-border)' }}>
              <th style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>Driver Info</th>
              <th style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>License</th>
              <th style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {drivers.length === 0 ? (
              <tr><td colSpan="3" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No drivers found.</td></tr>
            ) : (
              drivers.map((d) => (
                <tr key={d._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 600 }}>{d.name}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{d.email}</div>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                    <div>{d.licenseNumber}</div>
                    <div style={{color:'var(--color-text-muted)'}}>Exp: {new Date(d.licenseExpiry).toLocaleDateString()}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, background: d.status === 'Available' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(100, 116, 139, 0.2)', color: d.status === 'Available' ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
                      {d.status || 'Offline'}
                    </span>
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

export default Drivers;
