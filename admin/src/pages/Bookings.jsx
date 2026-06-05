import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [formData, setFormData] = useState({
    customerName: '', mobileNumber: '', pickupLocation: '', dropLocation: '', tripDate: '', vehicleType: '', amount: ''
  });
  const [assignData, setAssignData] = useState({ vehicleId: '', driverId: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bookingsRes, vehiclesRes, driversRes] = await Promise.all([
        api.get('/bookings'),
        api.get('/vehicles'),
        api.get('/drivers')
      ]);
      setBookings(bookingsRes.data);
      setVehicles(vehiclesRes.data.filter(v => v.status === 'Available'));
      setDrivers(driversRes.data.filter(d => d.status !== 'On Trip'));
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch bookings data');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };
  const handleAssignChange = (e) => { setAssignData({ ...assignData, [e.target.name]: e.target.value }); };

  const handleAddBooking = async (e) => {
    e.preventDefault();
    try {
      await api.post('/bookings', formData);
      setShowAddModal(false);
      setFormData({ customerName: '', mobileNumber: '', pickupLocation: '', dropLocation: '', tripDate: '', vehicleType: '', amount: '' });
      setLoading(true);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create booking');
    }
  };

  const openAssignModal = (booking) => {
    setSelectedBooking(booking);
    setAssignData({ vehicleId: '', driverId: '' });
    setShowAssignModal(true);
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if(!assignData.vehicleId || !assignData.driverId) return alert("Please select both a vehicle and driver.");
    try {
      await api.put(`/bookings/${selectedBooking._id}/assign`, assignData);
      setShowAssignModal(false);
      setLoading(true);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to assign resources');
    }
  };

  const handleDownloadInvoice = async (bookingId) => {
    try {
      const response = await api.get(`/bookings/${bookingId}/invoice`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice-${bookingId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      alert('Failed to download invoice');
    }
  };

  if (loading) return <div className="animate-fade-in"><h1 className="heading-1">Loading...</h1></div>;
  if (error) return <div className="animate-fade-in" style={{color: 'var(--color-danger)'}}>{error}</div>;

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="heading-1">Bookings</h1>
          <p className="text-muted">Manage trips, assign drivers, and track statuses.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', fontWeight: '600', cursor: 'pointer' }}>
          + New Booking
        </button>
      </div>

      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 className="heading-2" style={{ margin: 0 }}>Create Booking</h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--color-text)', cursor: 'pointer', fontSize: '1.5rem' }}>&times;</button>
            </div>
            <form onSubmit={handleAddBooking} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input type="text" name="customerName" placeholder="Customer Name" required value={formData.customerName} onChange={handleInputChange} className="modal-input" />
                <input type="text" name="mobileNumber" placeholder="Mobile Number" required value={formData.mobileNumber} onChange={handleInputChange} className="modal-input" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input type="text" name="pickupLocation" placeholder="Pickup Location" required value={formData.pickupLocation} onChange={handleInputChange} className="modal-input" />
                <input type="text" name="dropLocation" placeholder="Drop Location" required value={formData.dropLocation} onChange={handleInputChange} className="modal-input" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <input type="date" name="tripDate" required value={formData.tripDate} onChange={handleInputChange} className="modal-input" />
                <input type="text" name="vehicleType" placeholder="Vehicle Type (SUV, Sedan)" required value={formData.vehicleType} onChange={handleInputChange} className="modal-input" />
                <input type="number" name="amount" placeholder="Total Amount (₹)" required value={formData.amount} onChange={handleInputChange} className="modal-input" />
              </div>
              <button type="submit" style={{ background: 'var(--color-primary)', color: 'white', border: 'none', padding: '0.875rem', borderRadius: 'var(--radius-md)', fontWeight: '600', cursor: 'pointer', marginTop: '1rem' }}>Save Booking</button>
            </form>
          </div>
        </div>
      )}

      {showAssignModal && selectedBooking && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 className="heading-2" style={{ margin: 0 }}>Assign Resources</h2>
              <button onClick={() => setShowAssignModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--color-text)', cursor: 'pointer', fontSize: '1.5rem' }}>&times;</button>
            </div>
            <p style={{marginBottom:'1rem', fontSize:'0.9rem', color:'var(--color-text-muted)'}}>Assigning for {selectedBooking.bookingId} - {selectedBooking.customerName}</p>
            <form onSubmit={handleAssignSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <select name="vehicleId" value={assignData.vehicleId} onChange={handleAssignChange} className="modal-input" required>
                <option value="">Select Available Vehicle</option>
                {vehicles.map(v => <option key={v._id} value={v._id}>{v.vehicleNumber} ({v.brand} {v.model})</option>)}
              </select>
              <select name="driverId" value={assignData.driverId} onChange={handleAssignChange} className="modal-input" required>
                <option value="">Select Available Driver</option>
                {drivers.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
              </select>
              <button type="submit" style={{ background: 'var(--color-success)', color: 'white', border: 'none', padding: '0.875rem', borderRadius: 'var(--radius-md)', fontWeight: '600', cursor: 'pointer', marginTop: '1rem' }}>Confirm Assignment</button>
            </form>
          </div>
        </div>
      )}

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255, 255, 255, 0.05)', borderBottom: '1px solid var(--glass-border)' }}>
              <th style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>Trip Details</th>
              <th style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>Locations</th>
              <th style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>Assigned To</th>
              <th style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>Status</th>
              <th style={{ padding: '1rem', color: 'var(--color-text-muted)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No bookings found.</td></tr>
            ) : (
              bookings.map((b) => (
                <tr key={b._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 600, color:'var(--color-primary)' }}>{b.bookingId}</div>
                    <div>{b.customerName} ({b.mobileNumber})</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{new Date(b.tripDate).toLocaleDateString()} | {b.vehicleType} | ₹{b.amount}</div>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                    <div style={{color:'var(--color-success)'}}>↑ {b.pickupLocation}</div>
                    <div style={{color:'var(--color-danger)'}}>↓ {b.dropLocation}</div>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                    {b.driver ? (
                      <>
                        <div style={{fontWeight:600}}>{b.driver.name}</div>
                        <div style={{color:'var(--color-text-muted)'}}>{b.vehicle?.vehicleNumber}</div>
                      </>
                    ) : (
                      <span style={{color:'var(--color-text-muted)', fontStyle:'italic'}}>Unassigned</span>
                    )}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, background: b.bookingStatus === 'Confirmed' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)', color: b.bookingStatus === 'Confirmed' ? 'var(--color-success)' : 'orange' }}>
                      {b.bookingStatus}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    {b.bookingStatus === 'Pending' && (
                      <button onClick={() => openAssignModal(b)} style={{ background: 'var(--color-primary)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize:'0.8rem' }}>
                        Assign
                      </button>
                    )}
                    {(b.bookingStatus === 'Confirmed' || b.bookingStatus === 'Completed') && (
                      <button onClick={() => handleDownloadInvoice(b._id)} style={{ background: 'var(--color-secondary)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize:'0.8rem', marginLeft: '0.5rem' }}>
                        Invoice
                      </button>
                    )}
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

export default Bookings;
