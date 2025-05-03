"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input"; 
import { Button } from "@/components/ui/button";  

export default function RegisterForm({ role }) {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // New state for success message
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'password') {
      if (value.length < 8) {
        setPasswordError('Password must be at least 8 characters');
      } else if (!/\d/.test(value)) {
        setPasswordError('Password must contain at least one number');
      } else {
        setPasswordError('');
      }
      
      if (formData.confirmPassword && value !== formData.confirmPassword) {
        setConfirmPasswordError('Passwords do not match');
      } else {
        setConfirmPasswordError('');
      }
    }

    if (name === 'confirmPassword') {
      if (value !== formData.password) {
        setConfirmPasswordError('Passwords do not match');
      } else {
        setConfirmPasswordError('');
      }
    }
  };

  const validateForm = () => {
    if (!formData.firstname || !formData.lastname || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields');
      return false;
    }
    if (passwordError || confirmPasswordError) {
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage(''); // Clear any previous success message
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch(`http://localhost:4000/api/${role}/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        credentials: 'include', 
        body: JSON.stringify({
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email,
          password: formData.password,
          phone: formData.phone
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || 
          data.message || 
          `Registration failed with status ${response.status}`
        );
      }
      
      setSuccessMessage("Registration successful!"); // Set success message
      setTimeout(() => {
        router.push(`/login/${role}?registered=true`);
      }, 1500); // Redirect after showing message

    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-muted/50 p-6 rounded-md w-full max-w-sm shadow-md space-y-4 mx-auto mt-10"
    >
      <h2 className="text-xl font-semibold text-center">
        Register as {role.charAt(0).toUpperCase() + role.slice(1)}
      </h2>
      
      {error && (
        <div className="p-2 bg-red-50 text-red-600 rounded text-sm">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="p-2 bg-green-50 text-green-600 rounded text-sm">
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input
            type="text"
            name="firstname"
            placeholder="First Name"
            value={formData.firstname}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Input
            type="text"
            name="lastname"
            placeholder="Last Name"
            value={formData.lastname}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <Input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <div>
        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        {passwordError && (
          <p className="text-xs text-red-500 mt-1">{passwordError}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Password must be at least 8 characters and contain a number
        </p>
      </div>

      <div>
        <Input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        {confirmPasswordError && (
          <p className="text-xs text-red-500 mt-1">{confirmPasswordError}</p>
        )}
      </div>

      <Input
        type="tel"
        name="phone"
        placeholder="Phone Number (Optional)"
        value={formData.phone}
        onChange={handleChange}
      />

      <Button 
        type="submit" 
        className="w-full"
        disabled={isLoading || passwordError || confirmPasswordError}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Registering...
          </span>
        ) : (
          'Register'
        )}
      </Button>

      <div className="text-center text-sm">
        Already have an account?{' '}
        <button
          type="button"
          onClick={() => router.push(`/login/${role}`)}
          className="text-blue-500 hover:underline"
        >
          Login here
        </button>
      </div>
    </form>
  );
}