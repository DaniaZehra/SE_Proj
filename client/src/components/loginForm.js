"use client"
import { useState } from "react"
import { useRouter } from "next/router"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function LoginForm({ role }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
      const res = await fetch(`http://localhost:4000/api/${role}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Login failed")

      router.push(`/${role}/dashboard`)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-muted/50 p-6 rounded-md w-full max-w-sm shadow-md space-y-4 mx-auto mt-10"
    >
      <h2 className="text-xl font-semibold text-center">Login as {role}</h2>
      {error && <p className="text-red-600 text-sm">{error}</p>}

      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <Button type="submit" className="w-full">
        Login
      </Button>
    </form>
  )
}
