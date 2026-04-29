import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ProfileView() {
  const [profile, setProfile] = useState({ business_name: '', address: '', gstin: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await axios.get('/api/auth/profile', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setProfile(res.data);
    } catch (err) {}
    setLoading(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put('/api/auth/profile', profile, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMsg('Profile updated successfully!');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      alert('Error updating profile');
    }
    setSaving(false);
  };

  if (loading) return <div className="text-center p-5">Loading Profile...</div>;

  return (
    <div className="animate-fade-in">
      <div className="dashboard-header mb-4">
        <h2>Business Profile</h2>
        <p className="text-muted">Update your details for professional invoices.</p>
      </div>

      <div className="card" style={{ maxWidth: '600px' }}>
        {msg && <div className="badge badge-success mb-4" style={{ display: 'block', textAlign: 'center' }}>{msg}</div>}
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label className="form-label">Business Name</label>
            <input type="text" className="form-control" value={profile.business_name} onChange={e => setProfile({...profile, business_name: e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="form-label">GSTIN (Optional)</label>
            <input type="text" className="form-control" value={profile.gstin || ''} onChange={e => setProfile({...profile, gstin: e.target.value})} placeholder="e.g. 27AAAAA0000A1Z5" />
          </div>
          <div className="form-group">
            <label className="form-label">Contact Phone</label>
            <input type="text" className="form-control" value={profile.phone || ''} onChange={e => setProfile({...profile, phone: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Business Address (Shown on Bills)</label>
            <textarea className="form-control" style={{ minHeight: '100px' }} value={profile.address || ''} onChange={e => setProfile({...profile, address: e.target.value})} placeholder="Full registered address..."></textarea>
          </div>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
