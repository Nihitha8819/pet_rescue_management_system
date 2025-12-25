import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../api/apiClient';

const RegisterPet = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    species: 'dog',
    breed: '',
    gender: 'male',
    color: '',
    age: '',
    size: 'medium',
    vaccinated: false,
    neutered: false,
    notes: '',
  });

  const [images, setImages] = useState([]);

  if (!user) {
    return (
      <div className="pt-24 text-center text-red-500">
        Please login to register a pet.
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleImages = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('species', form.species);
      formData.append('breed', form.breed);
      formData.append('gender', form.gender);
      formData.append('color', form.color);
      formData.append('age', form.age);
      formData.append('size', form.size);
      formData.append('vaccinated', form.vaccinated ? 'true' : 'false');
      formData.append('neutered', form.neutered ? 'true' : 'false');
      formData.append('notes', form.notes);

      images.forEach((file) => {
        formData.append('images', file);
      });

      const response = await apiClient.post('/pets/register/', formData);
      console.log('Register pet success:', response.data);
      alert('Pet registered successfully and sent for approval.');
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to register pet', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.error ||
        'Failed to register pet. Please try again.';
      alert(msg);
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 px-4 pb-16">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-8">

        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
          🐾 Register Your Pet
        </h1>
        <p className="text-gray-500 mb-8">
          Add your pet details to help with adoption, care, or tracking
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* PET NAME */}
          <Input label="Pet Name" name="name" onChange={handleChange} />

          {/* SPECIES + BREED */}
          <div className="grid md:grid-cols-2 gap-4">
            <Select label="Species" name="species" onChange={handleChange}>
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
              <option value="bird">Bird</option>
              <option value="other">Other</option>
            </Select>

            <Input label="Breed" name="breed" onChange={handleChange} />
          </div>

          {/* GENDER + SIZE */}
          <div className="grid md:grid-cols-2 gap-4">
            <Select label="Gender" name="gender" onChange={handleChange}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </Select>

            <Select label="Size" name="size" onChange={handleChange}>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </Select>
          </div>

          {/* COLOR + AGE */}
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="Color" name="color" onChange={handleChange} />
            <Input label="Approx Age (years)" name="age" onChange={handleChange} />
          </div>

          {/* CHECKBOXES */}
          <div className="flex gap-6">
            <Checkbox
              label="Vaccinated"
              name="vaccinated"
              onChange={handleChange}
            />
            <Checkbox
              label="Neutered"
              name="neutered"
              onChange={handleChange}
            />
          </div>

          {/* NOTES */}
          <div>
            <label className="block font-medium mb-1">Special Notes</label>
            <textarea
              name="notes"
              rows="4"
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
              placeholder="Health, behavior, special care..."
            />
          </div>

          {/* IMAGES */}
          <div>
            <label className="block font-medium mb-1">
              Pet Photos
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImages}
              className="w-full"
            />
          </div>

          {/* ACTIONS */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-emerald-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-emerald-600"
            >
              Register Pet
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-gray-200 px-6 py-3 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ---------- REUSABLE UI ---------- */

const Input = ({ label, ...props }) => (
  <div>
    <label className="block font-medium mb-1">{label}</label>
    <input
      {...props}
      className="w-full border rounded-lg px-4 py-2"
      required
    />
  </div>
);

const Select = ({ label, children, ...props }) => (
  <div>
    <label className="block font-medium mb-1">{label}</label>
    <select
      {...props}
      className="w-full border rounded-lg px-4 py-2 bg-white"
    >
      {children}
    </select>
  </div>
);

const Checkbox = ({ label, ...props }) => (
  <label className="flex items-center gap-2">
    <input type="checkbox" {...props} />
    {label}
  </label>
);

export default RegisterPet;
