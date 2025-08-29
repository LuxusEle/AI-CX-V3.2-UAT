'use client'
import { useState } from "react"

export default function Login() {
  const [email, setEmail] = useState("admin@demo.test")
  const [password, setPassword] = useState("demo1234")
  const [tenantId, setTenantId] = useState("1")
  const [token, setToken] = useState<string|undefined>()

  const onLogin = async () => {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    setToken(data?.access_token)
    localStorage.setItem("access", data?.access_token || "")
    alert("Logged in. Use sections with X-Tenant-ID: " + tenantId)
  }

  return (
    <main className="space-y-3">
      <h2 className="text-xl font-semibold">Login</h2>
      <input className="border p-2 w-full" value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" />
      <input className="border p-2 w-full" value={password} type="password" onChange={e=>setPassword(e.target.value)} placeholder="password" />
      <input className="border p-2 w-full" value={tenantId} onChange={e=>setTenantId(e.target.value)} placeholder="tenant id (header)" />
      <button className="bg-black text-white px-4 py-2" onClick={onLogin}>Login</button>
      {token && <pre className="text-xs break-all">access: {token}</pre>}
    </main>
  )
}
