'use client'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

type Client = {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

export default function ClientDetails({ params }: { params: { id: string } }) {
  const clientId = params.id
  const [client, setClient] = useState<Client | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const router = useRouter()

  const token = typeof window !== 'undefined' ? localStorage.getItem("access") : ""
  const api = process.env.NEXT_PUBLIC_API_URL

  const loadClient = async () => {
    const res = await fetch(api + "/clients/" + clientId, {
      headers: { "Authorization": "Bearer " + token, "X-Tenant-ID": "1" }
    })
    const data = await res.json()
    setClient(data)
    setName(data.name)
    setEmail(data.email || "")
    setPhone(data.phone || "")
    setAddress(data.address || "")
  }

  useEffect(() => {
    loadClient()
  }, [clientId])

  const updateClient = async () => {
    await fetch(api + "/clients/" + clientId, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token, "X-Tenant-ID": "1" },
      body: JSON.stringify({ name, email, phone, address })
    })
    setEditMode(false)
    loadClient()
  }

  const deleteClient = async () => {
    if (confirm("Are you sure you want to delete this client?")) {
      await fetch(api + "/clients/" + clientId, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token, "X-Tenant-ID": "1" }
      })
      router.push("/clients")
    }
  }

  if (!client) return <div>Loading...</div>

  return (
    <main className="space-y-4">
      <h2 className="text-xl font-semibold mb-3">Client Details: {client.name}</h2>

      {editMode ? (
        <div className="space-y-3">
          <input className="border p-2 w-full" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
          <input className="border p-2 w-full" type="email" placeholder="Email (optional)" value={email} onChange={e => setEmail(e.target.value)} />
          <input className="border p-2 w-full" type="tel" placeholder="Phone (optional)" value={phone} onChange={e => setPhone(e.target.value)} />
          <textarea className="border p-2 w-full h-32" placeholder="Address (optional)" value={address} onChange={e => setAddress(e.target.value)} />
          <div className="flex gap-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={updateClient}>Save Changes</button>
            <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => setEditMode(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <p><strong>Name:</strong> {client.name}</p>
          <p><strong>Email:</strong> {client.email || "-"}</p>
          <p><strong>Phone:</strong> {client.phone || "-"}</p>
          <p><strong>Address:</strong> {client.address || "-"}</p>
          <div className="flex gap-2 mt-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => setEditMode(true)}>Edit Client</button>
            <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={deleteClient}>Delete Client</button>
          </div>
        </div>
      )}
      <Link href="/clients" className="text-blue-600 hover:underline mt-4 block">Back to Clients</Link>
    </main>
  )
}