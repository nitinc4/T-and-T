import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    vehicleNumber: '', vehicleType: '', brand: '', model: '', seatingCapacity: '', insuranceExpiry: '', permitExpiry: ''
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const { data } = await api.get('/vehicles');
      setVehicles(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch vehicles');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      await api.post('/vehicles', formData);
      setShowModal(false);
      setFormData({ vehicleNumber: '', vehicleType: '', brand: '', model: '', seatingCapacity: '', insuranceExpiry: '', permitExpiry: '' });
      setLoading(true);
      fetchVehicles();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add vehicle');
    }
  };

  if (loading) return <div className="animate-fade-in"><h1 className="heading-1">Loading...</h1></div>;
  if (error) return <div className="animate-fade-in" style={{color: 'var(--color-danger)'}}>{error}</div>;

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="heading-1">Vehicles</h1>
          <p className="text-muted">Manage your fleet and track maintenance.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', fontWeight: '600', cursor: 'pointer' }}>
          + Add Vehicle
        </button>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 className="heading-2" style={{ margin: 0 }}>Add New Vehicle</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--color-text)', cursor: 'pointer', fontSize: '1.5rem' }}>&times;</button>
            </div>
            <form onSubmit={handleAddVehicle} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input type="text" name="vehicleNumber" placeholder="Vehicle Number (e.g. MH 12 AB 1234)" required value={formData.vehicleNumber} onChange={handleInputChange} className="modal-input" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input type="text" name="vehicleType" placeholder="Type (SUV, Sedan)" required value={formData.vehicleType} onChange={handleInputChange} className="modal-input" />
                <input type="number" name="seatingCapacity" placeholder="Seating Capacity" required value={formData.seatingCapacity} onChange={handleInputChange} className="modal-input" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input type="text" name="brand" placeholder="Brand" required value={formData.brand} onChange={handleInputChange} className="modal-input" />
                <input type="text" name="model" placeholder="Model" required value={formData.model} onChange={handleInputChange} className="modal-input" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{display:'flex', flexDirection:'column', gap:'0.5rem'}}>
                  <label style={{fontSize: '0.8rem', color: 'var(--color-text-muted)'}}>Insurance Expiry</label>
                  <input type="date" name="insuranceExpiry" required value={formData.insuranceExpiry} onChange={handleInputChange} className="modal-input" />
                </div>
                <div style={{display:'flex', flexDirection:'column', gap:'0.5rem'}}>
                  <label style={{fontSize: '0.8rem', color: 'var(--color-text-muted)'}}>Permit Expiry</label>
                  <input type="date" name="permitExpiry" required value={formData.permitExpiry} onChange={handleInputChange} className="modal-input" />
                </div>
              </div>
              <button type="submit" style={{ background: 'var(--color-primary)', color: 'white', border: 'none', padding: '0.875rem', borderRadius: 'var(--radius-md)', fontWeight: '600', cursor: 'pointer', marginTop: '1rem' }}>
                Save Vehicle
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255, 255, 255, 0.05)', borderBottom: '1px solid var(--glass-border)' }}>
              <th style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>Vehicle Info</th>
              <th style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>Type</th>
              <th style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>Expiries</th>
              <th style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.length === 0 ? (
              <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No vehicles found.</td></tr>
            ) : (
              vehicles.map((v) => (
                <tr key={v._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 600 }}>{v.vehicleNumber}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{v.brand} {v.model}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>{v.vehicleType} <span style={{fontSize:'0.8rem', color:'var(--color-text-muted)'}}>({v.seatingCapacity} seats)</span></td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                    <div>Ins: {new Date(v.insuranceExpiry).toLocaleDateString()}</div>
                    <div>Permit: {new Date(v.permitExpiry).toLocaleDateString()}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, background: v.status === 'Available' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)', color: v.status === 'Available' ? 'var(--color-success)' : 'orange' }}>
                      {v.status}
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

export default Vehicles;
