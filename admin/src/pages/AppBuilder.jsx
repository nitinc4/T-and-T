import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

const AppBuilder = () => {
  const { user } = useContext(AuthContext);
  const [config, setConfig] = useState({
    theme: { primaryColor: '#FF385C', secondaryColor: '#00A699' },
    layout: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        if (!user || !user.companyId) return;
        const res = await api.get(`/public/companies/${user.companyId}/config`);
        setConfig(res.data);
      } catch (error) {
        console.error('Failed to load config', error);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      await api.put(`/companies/${user.companyId}/config`, { appConfig: config });
      setMessage('App UI Updated Successfully! Restart the mobile app to see changes.');
    } catch (error) {
      setMessage('Failed to save configuration.');
    } finally {
      setSaving(false);
    }
  };

  const handleColorChange = (e) => {
    setConfig({
      ...config,
      theme: { ...config.theme, primaryColor: e.target.value }
    });
  };

  const updateHeroText = (value) => {
    const newLayout = [...config.layout];
    const heroIndex = newLayout.findIndex(l => l.type === 'hero_banner');
    if (heroIndex >= 0) {
      newLayout[heroIndex].data.title = value;
      setConfig({ ...config, layout: newLayout });
    }
  };

  if (loading) return <div>Loading App Builder...</div>;

  const heroSection = config.layout.find(l => l.type === 'hero_banner');

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="heading-1">App Builder</h1>
          <p className="text-muted">Customize your mobile app's appearance.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          style={{
            background: 'var(--color-primary)',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          {saving ? 'Saving...' : 'Publish Changes'}
        </button>
      </div>

      {message && (
        <div style={{ padding: '1rem', background: '#e6ffe6', color: '#006600', marginBottom: '1.5rem', borderRadius: '8px' }}>
          {message}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        {/* Editor Controls */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Brand Identity</h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Primary Brand Color</label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <input 
                type="color" 
                value={config.theme.primaryColor} 
                onChange={handleColorChange}
                style={{ width: '50px', height: '50px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
              />
              <span style={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>{config.theme.primaryColor}</span>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '2rem 0' }} />

          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Hero Banner Settings</h2>
          
          {heroSection ? (
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Banner Title</label>
              <input 
                type="text" 
                value={heroSection.data.title} 
                onChange={(e) => updateHeroText(e.target.value)}
                style={{
                  width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)', background: 'transparent',
                  color: 'var(--color-text)'
                }}
              />
              <p style={{ fontSize: '0.8rem', color: 'gray', marginTop: '0.5rem' }}>This is the main headline displayed at the top of your app.</p>
            </div>
          ) : (
            <p>No Hero Banner in layout.</p>
          )}

        </div>

        {/* Live Preview (Simulated) */}
        <div style={{ 
          background: '#f0f0f0', 
          borderRadius: '30px', 
          padding: '10px', 
          maxWidth: '350px', 
          margin: '0 auto',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}>
          <div style={{ 
            background: 'white', 
            height: '600px', 
            borderRadius: '20px', 
            overflow: 'hidden',
            position: 'relative'
          }}>
            <div style={{ padding: '20px', fontWeight: 'bold', fontSize: '1.2rem', display: 'flex', justifyContent: 'space-between' }}>
              <span>Explore</span>
              <span>👤</span>
            </div>
            
            {/* Hero Preview */}
            {heroSection && (
              <div style={{
                margin: '10px',
                height: '180px',
                borderRadius: '16px',
                background: `url(${heroSection.data.imageUrl}) center/cover`,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '15px'
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', borderRadius: '16px' }}></div>
                <div style={{ position: 'relative', zIndex: 1, color: 'white' }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{heroSection.data.title}</h3>
                  <p style={{ margin: '5px 0 10px', fontSize: '0.8rem', opacity: 0.8 }}>{heroSection.data.subtitle}</p>
                  <button style={{ 
                    background: config.theme.primaryColor, 
                    border: 'none', 
                    color: 'white', 
                    padding: '8px 15px', 
                    borderRadius: '8px',
                    fontWeight: 'bold'
                  }}>{heroSection.data.actionText}</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppBuilder;
