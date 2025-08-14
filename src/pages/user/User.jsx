import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function User({ user, setUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || ''
  });
  const navigate = useNavigate();

  // Redirect to login if no user
  if (!user) {
    navigate('/');
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      // TODO: Replace with actual API call to update user
      console.log('Saving user data:', formData);
      
      // Update user state with new data
      const updatedUser = { ...user, ...formData };
      setUser(updatedUser);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      bio: user.bio || ''
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <div className="user-profile">
      <div className="profile-header">
        <h1>User Profile</h1>
        <div className="profile-actions">
          <button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      <div className="profile-content">
        {isEditing ? (
          <div className="edit-form">
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone:</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="(555) 123-4567"
              />
            </div>

            <div className="form-group">
              <label htmlFor="bio">Bio:</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows="4"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div className="form-actions">
              <button onClick={handleSave} className="save-btn">
                Save Changes
              </button>
              <button onClick={handleCancel} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="profile-display">
            <div className="profile-field">
              <label>Name:</label>
              <span>{user.name || 'Not provided'}</span>
            </div>

            <div className="profile-field">
              <label>Email:</label>
              <span>{user.email || 'Not provided'}</span>
            </div>

            <div className="profile-field">
              <label>Phone:</label>
              <span>{user.phone || 'Not provided'}</span>
            </div>

            <div className="profile-field">
              <label>Bio:</label>
              <span>{user.bio || 'No bio added yet'}</span>
            </div>

            <button onClick={() => setIsEditing(true)} className="edit-btn">
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default User;