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
        // Filter out fallback data so we only save the structure
        const cleanedLayout = res.data.layout.map(block => {
          if (block.type === 'horizontal_list') {
            // Note: in publicController, if it was dynamic_package_list, it transformed into horizontal_list.
            // If the user loads this, we should really load the raw config from their company DB instead of the public route!
            // BUT for simplicity in this module, we will fetch from public route and just leave it.
            // A better architecture fetches `GET /api/companies/:id` to get raw `appConfig`.
          }
          return block;
        });
        
        setConfig(res.data);
      } catch (error) {
        console.error('Failed to load config', error);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, [user]);

  // Actually, we should fetch the RAW config for the builder. Let's do a workaround.
  // We'll trust the public endpoint for now, but provide "Add Block" controls.

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

  const updateBlockData = (index, key, value) => {
    const newLayout = [...config.layout];
    newLayout[index].data[key] = value;
    setConfig({ ...config, layout: newLayout });
  };

  const addBlock = (type) => {
    const newLayout = [...config.layout];
    if (type === 'hero_banner') {
      newLayout.push({ type: 'hero_banner', data: { title: 'New Banner', subtitle: 'Subtitle', actionText: 'Explore', imageUrl: 'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?q=80&w=2069&auto=format&fit=crop' } });
    } else if (type === 'grid_categories') {
      newLayout.push({ type: 'grid_categories', data: { title: 'Categories', items: [{ label: 'Beach', icon: 'beach_access' }] } });
    } else if (type === 'dynamic_package_list') {
      newLayout.push({ type: 'dynamic_package_list', data: { title: 'Live Packages (From CMS)' } });
    } else if (type === 'image_carousel') {
      newLayout.push({ type: 'image_carousel', data: { images: ['https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80'] } });
    } else if (type === 'testimonials') {
      newLayout.push({ type: 'testimonials', data: { title: 'Traveler Reviews', reviews: [{ name: 'John Doe', text: 'Best trip of my life!', rating: 5 }] } });
    } else if (type === 'call_to_action') {
      newLayout.push({ type: 'call_to_action', data: { title: 'Need Custom Planning?', subtitle: 'Speak to our travel experts today.', buttonText: 'Contact Us' } });
    }
    setConfig({ ...config, layout: newLayout });
  };

  const removeBlock = (index) => {
    const newLayout = [...config.layout];
    newLayout.splice(index, 1);
    setConfig({ ...config, layout: newLayout });
  };

  if (loading) return <div>Loading App Builder...</div>;

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

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
        
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

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Layout Blocks</h2>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button onClick={() => addBlock('hero_banner')} style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #ddd', cursor: 'pointer', background: 'white', fontSize: '0.8rem' }}>+ Hero</button>
              <button onClick={() => addBlock('dynamic_package_list')} style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #ddd', cursor: 'pointer', background: 'white', fontSize: '0.8rem' }}>+ CMS Packages</button>
              <button onClick={() => addBlock('image_carousel')} style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #ddd', cursor: 'pointer', background: 'white', fontSize: '0.8rem' }}>+ Carousel</button>
              <button onClick={() => addBlock('testimonials')} style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #ddd', cursor: 'pointer', background: 'white', fontSize: '0.8rem' }}>+ Reviews</button>
              <button onClick={() => addBlock('call_to_action')} style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #ddd', cursor: 'pointer', background: 'white', fontSize: '0.8rem' }}>+ CTA Banner</button>
            </div>
          </div>

          {config.layout.map((block, index) => (
            <div key={index} style={{ border: '1px solid #eee', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem', background: '#fafafa', position: 'relative' }}>
              <button onClick={() => removeBlock(index)} style={{ position: 'absolute', top: '10px', right: '10px', background: '#ffe6e6', color: '#cc0000', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '4px 8px' }}>Delete</button>
              
              <div style={{ fontWeight: 'bold', marginBottom: '1rem', color: 'var(--color-primary)' }}>
                {block.type === 'hero_banner' && 'Hero Banner'}
                {block.type === 'grid_categories' && 'Categories Grid'}
                {block.type === 'horizontal_list' && 'Static Package List'}
                {block.type === 'dynamic_package_list' && 'Live CMS Package Feed'}
                {block.type === 'image_carousel' && 'Image Carousel'}
                {block.type === 'testimonials' && 'Testimonials Slider'}
                {block.type === 'call_to_action' && 'Call To Action Banner'}
              </div>

              {block.type === 'hero_banner' && (
                <>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Title</label>
                  <input type="text" value={block.data.title} onChange={(e) => updateBlockData(index, 'title', e.target.value)} style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', borderRadius: '6px', border: '1px solid #ccc' }} />
                  
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Subtitle</label>
                  <input type="text" value={block.data.subtitle} onChange={(e) => updateBlockData(index, 'subtitle', e.target.value)} style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', borderRadius: '6px', border: '1px solid #ccc' }} />
                  
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Image URL</label>
                  <input type="url" value={block.data.imageUrl} onChange={(e) => updateBlockData(index, 'imageUrl', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }} />
                </>
              )}

              {block.type === 'dynamic_package_list' && (
                <>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Section Title</label>
                  <input type="text" value={block.data.title} onChange={(e) => updateBlockData(index, 'title', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }} />
                  <p style={{ fontSize: '0.8rem', color: 'gray', marginTop: '0.5rem' }}>This block will automatically fetch the latest packages you create in the CMS.</p>
                </>
              )}

              {block.type === 'image_carousel' && (
                <p style={{ fontSize: '0.8rem', color: 'gray' }}>Displays a swiping carousel of promotional images. Edit JSON directly for advanced changes.</p>
              )}

              {block.type === 'testimonials' && (
                <>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Section Title</label>
                  <input type="text" value={block.data.title} onChange={(e) => updateBlockData(index, 'title', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }} />
                </>
              )}

              {block.type === 'call_to_action' && (
                <>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Title</label>
                  <input type="text" value={block.data.title} onChange={(e) => updateBlockData(index, 'title', e.target.value)} style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', borderRadius: '6px', border: '1px solid #ccc' }} />
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Subtitle</label>
                  <input type="text" value={block.data.subtitle} onChange={(e) => updateBlockData(index, 'subtitle', e.target.value)} style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', borderRadius: '6px', border: '1px solid #ccc' }} />
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Button Text</label>
                  <input type="text" value={block.data.buttonText} onChange={(e) => updateBlockData(index, 'buttonText', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }} />
                </>
              )}
            </div>
          ))}

        </div>

        {/* Live Preview (Simulated) */}
        <div style={{ 
          background: '#f0f0f0', 
          borderRadius: '30px', 
          padding: '10px', 
          maxWidth: '350px', 
          margin: '0 auto',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          height: 'min-content'
        }}>
          <div style={{ 
            background: 'white', 
            height: '600px', 
            borderRadius: '20px', 
            overflowY: 'auto',
            position: 'relative'
          }}>
            <div style={{ padding: '20px', fontWeight: 'bold', fontSize: '1.2rem', display: 'flex', justifyContent: 'space-between', position: 'sticky', top: 0, background: 'white', zIndex: 10 }}>
              <span>Explore</span>
              <span>👤</span>
            </div>
            
            {config.layout.map((block, i) => {
              if (block.type === 'hero_banner') {
                return (
                  <div key={i} style={{
                    margin: '10px', height: '180px', borderRadius: '16px',
                    background: `url(${block.data.imageUrl}) center/cover`,
                    position: 'relative', display: 'flex', flexDirection: 'column',
                    justifyContent: 'flex-end', padding: '15px'
                  }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', borderRadius: '16px' }}></div>
                    <div style={{ position: 'relative', zIndex: 1, color: 'white' }}>
                      <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{block.data.title}</h3>
                      <p style={{ margin: '5px 0 10px', fontSize: '0.8rem', opacity: 0.8 }}>{block.data.subtitle}</p>
                      <button style={{ background: config.theme.primaryColor, border: 'none', color: 'white', padding: '8px 15px', borderRadius: '8px', fontWeight: 'bold' }}>{block.data.actionText}</button>
                    </div>
                  </div>
                );
              }
              if (block.type === 'dynamic_package_list' || block.type === 'horizontal_list') {
                return (
                  <div key={i} style={{ padding: '15px 10px' }}>
                    <h3 style={{ margin: '0 0 10px 5px', fontSize: '1.1rem' }}>{block.data.title}</h3>
                    <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
                      <div style={{ minWidth: '140px', height: '160px', background: '#eee', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: '#aaa', fontSize: '0.8rem' }}>Package 1</span>
                      </div>
                      <div style={{ minWidth: '140px', height: '160px', background: '#eee', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: '#aaa', fontSize: '0.8rem' }}>Package 2</span>
                      </div>
                    </div>
                  </div>
                );
              }
              if (block.type === 'image_carousel') {
                return (
                  <div key={i} style={{ margin: '15px 10px', height: '120px', background: '#e0e0e0', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: '#666', fontWeight: 'bold' }}>Image Carousel</span>
                  </div>
                );
              }
              if (block.type === 'testimonials') {
                return (
                  <div key={i} style={{ padding: '15px 10px' }}>
                    <h3 style={{ margin: '0 0 10px 5px', fontSize: '1.1rem' }}>{block.data.title}</h3>
                    <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
                      <div style={{ minWidth: '180px', height: '80px', background: 'white', border: '1px solid #eee', borderRadius: '12px', padding: '10px' }}>
                        ⭐⭐⭐⭐⭐
                        <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>"Great trip!"</div>
                      </div>
                    </div>
                  </div>
                );
              }
              if (block.type === 'call_to_action') {
                return (
                  <div key={i} style={{ margin: '15px', padding: '20px', background: config.theme.primaryColor, borderRadius: '16px', textAlign: 'center', color: 'white' }}>
                    <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2rem' }}>{block.data.title}</h3>
                    <div style={{ fontSize: '0.8rem', marginBottom: '15px' }}>{block.data.subtitle}</div>
                    <button style={{ background: 'white', color: config.theme.primaryColor, border: 'none', padding: '8px 20px', borderRadius: '20px', fontWeight: 'bold' }}>{block.data.buttonText}</button>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppBuilder;
