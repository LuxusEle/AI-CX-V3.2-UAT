'use client'
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Register() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [tenantName, setTenantName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const api = process.env.NEXT_PUBLIC_API_URL

  const handleRegister = async () => {
    setError(null)
    try {
      const res = await fetch(api + "/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, tenant_name: tenantName })
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.detail || "Registration failed")
      }

      const j = await res.json()
      localStorage.setItem("access", j.access_token)
      localStorage.setItem("refresh", j.refresh_token)
      alert("Registration successful! You are now logged in.")
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
        <div className="space-y-4">
          <input 
            type="email" 
            placeholder="Email" 
            className="w-full p-3 border border-gray-300 rounded-md"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full p-3 border border-gray-300 rounded-md"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <input 
            type="text" 
            placeholder="Tenant Name" 
            className="w-full p-3 border border-gray-300 rounded-md"
            value={tenantName}
            onChange={e => setTenantName(e.target.value)}
          />
          <button 
            onClick={handleRegister} 
            className="w-full bg-green-600 text-white p-3 rounded-md font-semibold hover:bg-green-700 transition-colors"
          >
            Register
          </button>
          <p className="text-center text-sm text-gray-600">
            Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Login here</Link>
          </p>
        </div>
      </div>
    </main>
  )
}