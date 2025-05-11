"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; 
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginForm({ role }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); 
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage(""); 
    setIsLoading(true);

    try {
      if (!email || !password) {
        throw new Error("Please provide both email and password");
      }
      const response = await fetch(`http://localhost:4000/api/${role}/login`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        credentials: "include", 
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || 
          errorData.message || 
          `Login failed with status ${response.status}`
        );
      }

      const data = await response.json();
      setSuccessMessage("Login successful!"); // Set success message
      localStorage.setItem('token', data.token);

      // Store ownerId if logging in as property owner
      if (role === "propertyOwner" && data.owner && data.owner._id) {
        localStorage.setItem("ownerId", data.owner._id);
      }

      setTimeout(() => {
        router.push(`/${role}`);
      }, 1500); // Redirect after showing message
      
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-muted/50 p-6 rounded-md w-full max-w-sm shadow-md space-y-4 mx-auto mt-10"
    >
      <h2 className="text-xl font-semibold text-center">Login as {role}</h2>
      
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

      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full"
      />

      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full"
      />

      <Button 
        type="submit" 
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
}