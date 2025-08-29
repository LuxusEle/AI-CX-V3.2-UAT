'use client'
import { useEffect, useState } from "react"
import Link from "next/link"

type Lead = {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  status: string;
  source?: string;
  value: number;
  created_at: string;
}

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const token = typeof window !== 'undefined' ? localStorage.getItem("access") : ""
  const api = process.env.NEXT_PUBLIC_API_URL

  const loadLeads = async () => {
    const res = await fetch(api + "/leads", {
      headers: { "Authorization": "Bearer " + token, "X-Tenant-ID": "1" }
    })
    setLeads(await res.json())
  }

  useEffect(() => {
    loadLeads()
  }, [])

  return (
    <main>
      <h2 className="text-xl font-semibold mb-3">Leads</h2>
      <div className="mb-4">
        <Link href="/leads/create" className="bg-black text-white px-4 py-2 rounded">Create New Lead</Link>
      </div>
      <ul className="space-y-2">
        {leads.map(lead => (
          <li key={lead.id} className="p-3 border rounded bg-white flex justify-between items-center">
            <div>
              <Link href={`/leads/${lead.id}`} className="text-blue-600 hover:underline font-medium">{lead.name}</Link>
              <p className="text-sm text-gray-600">{lead.email} | {lead.phone}</p>
              <p className="text-sm text-gray-600">Status: {lead.status} | Value: ${lead.value?.toFixed(2)}</p>
            </div>
            <Link href={`/leads/${lead.id}`} className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm">View/Edit</Link>
          </li>
        ))}
      </ul>
    </main>
  )
}