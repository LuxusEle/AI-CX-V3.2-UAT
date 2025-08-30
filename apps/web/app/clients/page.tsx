'use client'
import { useEffect, useState } from "react"
import Link from "next/link"

type Client = {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([])
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")

  const token = typeof window !== 'undefined' ? localStorage.getItem("access") : ""
  const api = process.env.NEXT_PUBLIC_API_URL

  const loadClients = async () => {
    const res = await fetch(api + "/clients", {
      headers: { "Authorization": "Bearer " + token, "X-Tenant-ID": "1" }
    })
    setClients(await res.json())
  }
  useEffect(()=>{ loadClients() },[])

  const createClient = async () => {
    await fetch(api + "/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token, "X-Tenant-ID": "1" },
      body: JSON.stringify({ name, email, phone, address })
    })
    setName(""); setEmail(""); setPhone(""); setAddress("")
    loadClients()
  }

  return (
    <main>
      <h2 className="text-xl font-semibold mb-3">Clients</h2>
      <div className="flex gap-2 mb-4">
        <input className="border p-2" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="border p-2" type="email" placeholder="Email (optional)" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="border p-2" type="tel" placeholder="Phone (optional)" value={phone} onChange={e=>setPhone(e.target.value)} />
        <input className="border p-2" placeholder="Address (optional)" value={address} onChange={e=>setAddress(e.target.value)} />
        <button className="bg-black text-white px-3 py-2 rounded" onClick={createClient}>Add Client</button>
      </div>
      <ul className="space-y-2">
        {clients.map(client => (
          <li key={client.id} className="p-3 border rounded bg-white flex justify-between items-center">
            <div>
              <Link href={`/clients/${client.id}`} className="text-blue-600 hover:underline font-medium">{client.name}</Link>
              <p className="text-sm text-gray-600">{client.email} | {client.phone}</p>
              <p className="text-sm text-gray-600">{client.address}</p>
            </div>
            <Link href={`/clients/${client.id}`} className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm">View/Edit</Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
