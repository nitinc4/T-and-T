import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', price: '', imageUrl: '', duration: '', destination: '' });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await api.get('/packages');
      setPackages(res.data);
    } catch (error) {
      console.error("Failed to fetch packages", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/packages', formData);
      setShowModal(false);
      setFormData({ title: '', price: '', imageUrl: '', duration: '', destination: '' });
      fetchPackages();
    } catch (error) {
      console.error("Failed to create package", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        await api.delete(`/packages/${id}`);
        fetchPackages();
      } catch (error) {
        console.error("Failed to delete package", error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="heading-1">Tour Packages</h1>
        <button 
          onClick={() => setShowModal(true)}
          style={{ background: 'var(--color-primary)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer', fontWeight: 600 }}
        >
          + Add Package
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
        {packages.map((pkg) => (
          <div key={pkg._id} className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
            <img src={pkg.imageUrl} alt={pkg.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            <div style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>{pkg.title}</h3>
              <p style={{ color: 'var(--color-primary)', fontWeight: 700, marginBottom: '0.5rem' }}>{pkg.price}</p>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: 'gray', marginBottom: '1rem' }}>
                <span>{pkg.duration}</span>
                <span>•</span>
                <span>{pkg.destination}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  onClick={() => handleDelete(pkg._id)}
                  style={{ background: '#ffe6e6', color: '#cc0000', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {packages.length === 0 && <p className="text-muted">No packages found. Create one to get started!</p>}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Create New Package</h2>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input type="text" placeholder="Package Title (e.g., Bali Getaway)" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
              <input type="text" placeholder="Price (e.g., ₹25,000)" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
              <input type="url" placeholder="Image URL" required value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
              <input type="text" placeholder="Duration (e.g., 5 Days / 4 Nights)" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
              <input type="text" placeholder="Destination" value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ background: 'transparent', padding: '0.75rem 1.5rem', borderRadius: '8px', border: '1px solid #ddd', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ background: 'var(--color-primary)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Save Package</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Packages;
