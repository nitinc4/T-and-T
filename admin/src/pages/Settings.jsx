import { useState, useEffect } from 'react';
import api from '../api/axios';

const Settings = () => {
  const [razorpayKeyId, setRazorpayKeyId] = useState('');
  const [razorpayKeySecret, setRazorpayKeySecret] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Note: For a fully secure system, we'd fetch the existing KeyId (but never the secret) 
  // on mount. For simplicity we just let them overwrite it.

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    
    try {
      await api.put('/companies/me/razorpay-keys', {
        razorpayKeyId,
        razorpayKeySecret
      });
      setMessage('Razorpay keys saved successfully!');
      setRazorpayKeySecret(''); // Clear secret from UI after saving
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Company Settings</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Payment Gateway (Razorpay)</h2>
        <p className="text-gray-600 mb-6 text-sm">
          Enter your Razorpay API keys to allow customers to pay directly to your account.
        </p>

        {message && (
          <div className={`p-4 mb-6 rounded-lg ${message.includes('success') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Razorpay Key ID</label>
            <input
              type="text"
              required
              value={razorpayKeyId}
              onChange={(e) => setRazorpayKeyId(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="rzp_live_..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Razorpay Key Secret</label>
            <input
              type="password"
              required
              value={razorpayKeySecret}
              onChange={(e) => setRazorpayKeySecret(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter your secret key"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Keys'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
