import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    ownerName: '',
    mobileNumber: '',
    email: '',
    gstNumber: '',
    address: '',
    planType: 'Starter'
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const { data } = await api.get('/companies');
      setCompanies(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch companies');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddCompany = async (e) => {
    e.preventDefault();
    try {
      await api.post('/companies', formData);
      setShowModal(false);
      setFormData({ name: '', ownerName: '', mobileNumber: '', email: '', gstNumber: '', address: '', planType: 'Starter' });
      setLoading(true);
      fetchCompanies();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create company');
    }
  };

  if (loading) return <div className="animate-fade-in"><h1 className="heading-1">Loading...</h1></div>;
  if (error) return <div className="animate-fade-in" style={{color: 'var(--color-danger)'}}>{error}</div>;

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="heading-1">Companies</h1>
          <p className="text-muted">Manage travel companies and their subscriptions.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          style={{
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: 'var(--radius-md)',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
          + Add Company
        </button>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 className="heading-2" style={{ margin: 0 }}>Add New Company</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--color-text)', cursor: 'pointer', fontSize: '1.5rem' }}>&times;</button>
            </div>
            <form onSubmit={handleAddCompany} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input type="text" name="name" placeholder="Company Name" required value={formData.name} onChange={handleInputChange} className="modal-input" />
                <input type="text" name="ownerName" placeholder="Owner Name" required value={formData.ownerName} onChange={handleInputChange} className="modal-input" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input type="email" name="email" placeholder="Email Address" required value={formData.email} onChange={handleInputChange} className="modal-input" />
                <input type="text" name="mobileNumber" placeholder="Mobile Number" required value={formData.mobileNumber} onChange={handleInputChange} className="modal-input" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input type="text" name="gstNumber" placeholder="GST Number (Optional)" value={formData.gstNumber} onChange={handleInputChange} className="modal-input" />
                <select name="planType" value={formData.planType} onChange={handleInputChange} className="modal-input">
                  <option value="Starter">Starter</option>
                  <option value="Professional">Professional</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
              </div>
              <input type="text" name="address" placeholder="Address" required value={formData.address} onChange={handleInputChange} className="modal-input" />
              <button type="submit" style={{ background: 'var(--color-primary)', color: 'white', border: 'none', padding: '0.875rem', borderRadius: 'var(--radius-md)', fontWeight: '600', cursor: 'pointer', marginTop: '1rem' }}>
                Save Company
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255, 255, 255, 0.05)', borderBottom: '1px solid var(--glass-border)' }}>
              <th style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>Company Name</th>
              <th style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>Owner</th>
              <th style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>Plan</th>
              <th style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>Status</th>
              <th style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No companies found.</td>
              </tr>
            ) : (
              companies.map((company) => (
                <tr key={company._id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background var(--transition-fast)' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 600 }}>{company.name}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{company.email}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div>{company.ownerName}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{company.mobileNumber}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '999px', 
                      fontSize: '0.75rem', 
                      fontWeight: 600,
                      background: 'rgba(99, 102, 241, 0.2)',
                      color: 'var(--color-primary)'
                    }}>
                      {company.planType}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '999px', 
                      fontSize: '0.75rem', 
                      fontWeight: 600,
                      background: company.isActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      color: company.isActive ? 'var(--color-success)' : 'var(--color-danger)'
                    }}>
                      {company.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <button style={{ background: 'transparent', border: '1px solid var(--color-border)', color: 'var(--color-text)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>
                      Edit
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

export default Companies;
