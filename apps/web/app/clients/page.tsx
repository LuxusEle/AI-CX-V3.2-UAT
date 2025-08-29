'use client'
import { useEffect, useState } from "react"

export default function Clients() {
  const [items, setItems] = useState<any[]>([])
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  const load = async () => {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/clients", {
      headers: { "Authorization": "Bearer " + localStorage.getItem("access"), "X-Tenant-ID": "1" }
    })
    setItems(await res.json())
  }
  useEffect(()=>{ load() },[])

  const createClient = async () => {
    await fetch(process.env.NEXT_PUBLIC_API_URL + "/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + localStorage.getItem("access"), "X-Tenant-ID": "1" },
      body: JSON.stringify({ name, email })
    })
    setName(""); setEmail("")
    load()
  }

  return (
    <main>
      <h2 className="text-xl font-semibold mb-3">Clients</h2>
      <div className="flex gap-2 mb-4">
        <input className="border p-2" placeholder="name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="border p-2" placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <button className="bg-black text-white px-3" onClick={createClient}>Add</button>
      </div>
      <ul className="space-y-2">
        {items.map((c,i)=>(<li key={i} className="p-3 border rounded bg-white">{c.name} — {c.email || "-"}</li>))}
      </ul>
    </main>
  )
}
