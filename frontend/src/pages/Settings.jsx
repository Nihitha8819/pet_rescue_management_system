import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../api/apiClient';

const Settings = () => {
  const { user } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );

  const [emailNotify, setEmailNotify] = useState(true);
  const [petAlerts, setPetAlerts] = useState(true);
  const [statusUpdates, setStatusUpdates] = useState(true);

  const [hideEmail, setHideEmail] = useState(false);
  const [publicProfile, setPublicProfile] = useState(true);

  const [defaultPet, setDefaultPet] = useState('dog');
  const [radius, setRadius] = useState(10);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load user profile/preferences from backend on mount
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      try {
        const response = await apiClient.get('/users/profile/');
        const data = response.data;
        setName(data.name || '');
        // Map theme_preference to darkMode toggle
        const themePref = data.theme_preference || 'system';
        const isDark = themePref === 'dark' || localStorage.getItem('theme') === 'dark';
        setDarkMode(isDark);
        setEmailNotify(data.email_notifications_enabled ?? true);
      } catch (e) {
        console.error('Failed to load profile', e);
      }
    };

    loadProfile();
  }, [user]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Update profile (name, and potentially address/phone later)
      await apiClient.put('/users/profile/', {
        name,
        // Keep existing values for fields we don't expose yet
      });

      // Update preferences (theme + email notifications)
      const theme_preference = darkMode ? 'dark' : 'light';
      await apiClient.put('/users/preferences/', {
        theme_preference,
        email_notifications_enabled: emailNotify,
      });

      setSuccess('Settings saved successfully.');
    } catch (err) {
      console.error('Failed to save settings', err);
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.error ||
        'Failed to save settings. Please try again.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-gray-100 dark:bg-gray-900 transition">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8">

        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          ⚙️ Account Settings
        </h1>

        {/* PROFILE */}
        <Section title="Profile">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-black text-3xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {user?.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {user?.email}
              </p>
            </div>
          </div>

          <Input label="Full Name" value={name} onChange={setName} />
        </Section>

        {/* APPEARANCE */}
        <Section title="Appearance">
          <Toggle label="Dark Mode" checked={darkMode} setChecked={setDarkMode} />
        </Section>

        {/* NOTIFICATIONS */}
        <Section title="Notifications">
          <Toggle label="Email Notifications" checked={emailNotify} setChecked={setEmailNotify} />
          <Toggle label="Pet Match Alerts" checked={petAlerts} setChecked={setPetAlerts} />
          <Toggle label="Report Status Updates" checked={statusUpdates} setChecked={setStatusUpdates} />
        </Section>

        {/* PRIVACY */}
        <Section title="Privacy">
          <Toggle label="Hide Email from Public" checked={hideEmail} setChecked={setHideEmail} />
          <Toggle label="Public Profile Visibility" checked={publicProfile} setChecked={setPublicProfile} />
        </Section>

        {/* PREFERENCES */}
        <Section title="Preferences">
          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
              Default Pet Type
            </label>
            <select
              value={defaultPet}
              onChange={(e) => setDefaultPet(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
              Search Radius: {radius} km
            </label>
            <input
              type="range"
              min="1"
              max="50"
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              className="w-full accent-emerald-500"
            />
          </div>
        </Section>

        {/* ALERTS */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 text-red-700 px-4 py-2 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-lg bg-emerald-50 text-emerald-700 px-4 py-2 text-sm">
            {success}
          </div>
        )}

        {/* ACTIONS */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleSave}
            className="bg-emerald-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-emerald-600 transition"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------- UI HELPERS ---------- */

const Section = ({ title, children }) => (
  <div className="mb-10 bg-gray-50 dark:bg-gray-700 rounded-2xl p-6">
    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
      {title}
    </h2>
    <div className="space-y-4">{children}</div>
  </div>
);

const Input = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
      {label}
    </label>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
    />
  </div>
);

const Toggle = ({ label, checked, setChecked }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
      {label}
    </span>
    <button
      onClick={() => setChecked(!checked)}
      className={`w-12 h-6 rounded-full transition ${
        checked ? 'bg-emerald-500' : 'bg-gray-400'
      }`}
    >
      <div
        className={`h-5 w-5 bg-white rounded-full shadow transform transition ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

export default Settings;
