"use client";
import { useState } from "react";
import { useRouter } from "next/router";
import { Input } from "@/components/ui/input"; 
import { Button } from "@/components/ui/button";  

export default function RegisterForm({ role }) {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`http://localhost:5000/api/${role}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      alert('Registration successful!');
      router.push(`/${role}/login`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-muted/50 p-6 rounded-md w-full max-w-sm shadow-md space-y-4 mx-auto mt-10"
    >
      <h2 className="text-xl font-semibold text-center">Register as {role.charAt(0).toUpperCase() + role.slice(1)}</h2>
      {error && <p className="text-red-600 text-sm">{error}</p>}

      <Input
        type="text"
        name="firstname"
        placeholder="First Name"
        value={formData.firstname}
        onChange={handleChange}
        required
      />

      <Input
        type="text"
        name="lastname"
        placeholder="Last Name"
        value={formData.lastname}
        onChange={handleChange}
        required
      />

      <Input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <Input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />

      <Button type="submit" className="w-full">
        Register
      </Button>
    </form>
  );
}
