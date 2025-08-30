'use client'
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

type Client = {
  id: number;
  name: string;
}

export default function CreateProject() {
  const [name, setName] = useState("")
  const [clientId, setClientId] = useState<number | undefined>(undefined)
  const [status, setStatus] = useState("draft")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [clients, setClients] = useState<Client[]>([])
  const router = useRouter()

  const token = typeof window !== 'undefined' ? localStorage.getItem("access") : ""
  const api = process.env.NEXT_PUBLIC_API_URL

  const loadClients = async () => {
    const res = await fetch(api + "/clients", {
      headers: { "Authorization": "Bearer " + token, "X-Tenant-ID": "1" }
    })
    setClients(await res.json())
  }

  useEffect(() => {
    loadClients()
  }, [])

  const createProject = async () => {
    await fetch(api + "/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token, "X-Tenant-ID": "1" },
      body: JSON.stringify({ 
        name, 
        client_id: clientId, 
        status, 
        start_date: startDate || null, 
        end_date: endDate || null 
      })
    })
    router.push("/projects")
  }

  return (
    <main className="space-y-4">
      <h2 className="text-xl font-semibold mb-3">Create New Project</h2>
      <input className="border p-2 w-full" placeholder="Project Name" value={name} onChange={e => setName(e.target.value)} />
      
      <select className="border p-2 w-full" value={clientId || ""} onChange={e => setClientId(e.target.value ? parseInt(e.target.value) : undefined)}>
        <option value="">Select Client (optional)</option>
        {clients.map(client => (
          <option key={client.id} value={client.id}>{client.name}</option>
        ))}
      </select>

      <select className="border p-2 w-full" value={status} onChange={e => setStatus(e.target.value)}>
        <option value="draft">Draft</option>
        <option value="active">Active</option>
        <option value="completed">Completed</option>
        <option value="archived">Archived</option>
      </select>

      <input className="border p-2 w-full" type="date" placeholder="Start Date (optional)" value={startDate} onChange={e => setStartDate(e.target.value)} />
      <input className="border p-2 w-full" type="date" placeholder="End Date (optional)" value={endDate} onChange={e => setEndDate(e.target.value)} />
      
      <button className="bg-black text-white px-4 py-2 rounded" onClick={createProject}>Create Project</button>
      <Link href="/projects" className="text-blue-600 hover:underline mt-4 block">Back to Projects</Link>
    </main>
  )
}