"use client";

import React, { useState } from 'react';

export default function UserForm() {
  const [form, setForm] = useState({
    name: '',
    birthdate: '',
    gender: '',
    country: '',
    profession: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit to chain
    alert('Profile submitted! (on-chain logic not implemented)');
  };

  return (
    <form className="space-y-2" onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" className="w-full p-2 border border-gray-300 rounded-md" value={form.name} onChange={handleChange} required />
      <input name="birthdate" type="date" className="w-full p-2 border border-gray-300 rounded-md" value={form.birthdate} onChange={handleChange} required />
      <select name="gender" className="w-full p-2 border border-gray-300 rounded-md" value={form.gender} onChange={handleChange} required>
        <option value="">Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
      <input name="country" placeholder="Country" className="w-full p-2 border border-gray-300 rounded-md" value={form.country} onChange={handleChange} required />
      <input name="profession" placeholder="Profession" className="w-full p-2 border border-gray-300 rounded-md" value={form.profession} onChange={handleChange} required />
      <button className="w-full bg-blue-600 text-white rounded-md py-2 px-4 font-medium hover:bg-blue-700" type="submit">
        Save Profile
      </button>
    </form>
  );
}
