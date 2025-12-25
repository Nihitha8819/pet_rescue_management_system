import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const ReportPet = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [formData, setFormData] = useState({
    pet_name: '',
    pet_type: 'dog',
    description: '',
    location_found: '',
    contact_info: '',
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + images.length > 10) {
      setError('You can upload up to 10 images only.');
      return;
    }

    setImages([...images, ...files]);
    setImagePreviews([
      ...imagePreviews,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
    setError('');
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        submitData.append(key, value)
      );
      images.forEach((img, i) => submitData.append(`images[${i}]`, img));

      await axios.post(`${API_URL}/pets/report/create/`, submitData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess('Pet report submitted successfully!');
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));

      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.detail ||
          'Failed to submit report.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="pt-24 px-6">
        <div className="bg-yellow-50 p-4 rounded-xl text-yellow-800">
          Please log in to report a pet.
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 px-4 pb-16">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">
            Report a Found / Lost Pet 🐾
          </h1>
          <p className="text-gray-400 mt-2">
            Help reunite pets with their families
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 bg-red-50 p-4 rounded-xl text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 bg-green-50 p-4 rounded-xl text-green-700">
            {success}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-xl p-6 md:p-8 space-y-6"
        >
          <Input label="Pet Name" name="pet_name" value={formData.pet_name} onChange={handleChange} required />

          <Select
            label="Pet Type"
            name="pet_type"
            value={formData.pet_type}
            onChange={handleChange}
            options={['dog', 'cat', 'bird', 'rabbit', 'other']}
          />

          <Textarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe appearance and behavior"
            required
          />

          <Input
            label="Location Found"
            name="location_found"
            value={formData.location_found}
            onChange={handleChange}
            placeholder="Area or landmark"
            required
          />

          <Input
            label="Contact Information"
            name="contact_info"
            value={formData.contact_info}
            onChange={handleChange}
            placeholder="Phone or email"
            required
          />

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Pet Images ({images.length}/10)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-2"
            />

            {imagePreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {imagePreviews.map((img, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={img}
                      alt="preview"
                      className="w-full h-28 object-cover rounded-xl border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-emerald-500 text-black py-3 rounded-xl font-semibold hover:bg-emerald-600 transition"
            >
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 border border-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ---------- Small Inputs ---------- */

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">
      {label}
    </label>
    <input
      {...props}
      className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-emerald-500"
    />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">
      {label}
    </label>
    <textarea
      {...props}
      rows="4"
      className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-emerald-500"
    />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">
      {label}
    </label>
    <select
      {...props}
      className="w-full rounded-xl border border-gray-300 px-4 py-2 bg-white focus:ring-2 focus:ring-emerald-500"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o.charAt(0).toUpperCase() + o.slice(1)}
        </option>
      ))}
    </select>
  </div>
);

export default ReportPet;
