'use client'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

type Lead = {
  id: number;
  client_id?: number;
  name: string;
  email?: string;
  phone?: string;
  status: string;
  source?: string;
  value: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export default function LeadDetails({ params }: { params: { id: string } }) {
  const leadId = params.id
  const [lead, setLead] = useState<Lead | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [status, setStatus] = useState("")
  const [source, setSource] = useState("")
  const [value, setValue] = useState(0.0)
  const [notes, setNotes] = useState("")
  const router = useRouter()

  const token = typeof window !== 'undefined' ? localStorage.getItem("access") : ""
  const api = process.env.NEXT_PUBLIC_API_URL

  const loadLead = async () => {
    const res = await fetch(api + "/leads/" + leadId, {
      headers: { "Authorization": "Bearer " + token, "X-Tenant-ID": "1" }
    })
    const data = await res.json()
    setLead(data)
    setName(data.name)
    setEmail(data.email || "")
    setPhone(data.phone || "")
    setStatus(data.status)
    setSource(data.source || "")
    setValue(data.value || 0.0)
    setNotes(data.notes || "")
  }

  useEffect(() => {
    loadLead()
  }, [leadId])

  const updateLead = async () => {
    await fetch(api + "/leads/" + leadId, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token, "X-Tenant-ID": "1" },
      body: JSON.stringify({ name, email, phone, status, source, value, notes })
    })
    setEditMode(false)
    loadLead()
  }

  const deleteLead = async () => {
    if (confirm("Are you sure you want to delete this lead?")) {
      await fetch(api + "/leads/" + leadId, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token, "X-Tenant-ID": "1" }
      })
      router.push("/leads")
    }
  }

  const winLead = async () => {
    if (confirm("Are you sure you want to mark this lead as 'won' and create a project?")) {
      await fetch(api + "/leads/" + leadId + "/win", {
        method: "POST",
        headers: { "Authorization": "Bearer " + token, "X-Tenant-ID": "1" }
      })
      alert("Lead marked as won and project created!")
      loadLead()
    }
  }

  if (!lead) return <div>Loading...</div>

  return (
    <main className="space-y-4">
      <h2 className="text-xl font-semibold mb-3">Lead Details: {lead.name}</h2>

      {editMode ? (
        <div className="space-y-3">
          <input className="border p-2 w-full" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
          <input className="border p-2 w-full" type="email" placeholder="Email (optional)" value={email} onChange={e => setEmail(e.target.value)} />
          <input className="border p-2 w-full" type="tel" placeholder="Phone (optional)" value={phone} onChange={e => setPhone(e.target.value)} />
          <select className="border p-2 w-full" value={status} onChange={e => setStatus(e.target.value)}>
            <option value="new">New</option>
            <option value="qualified">Qualified</option>
            <option value="proposal">Proposal</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
          </select>
          <input className="border p-2 w-full" placeholder="Source" value={source} onChange={e => setSource(e.target.value)} />
          <input className="border p-2 w-full" type="number" placeholder="Estimated Value" value={value} onChange={e => setValue(parseFloat(e.target.value))} />
          <textarea className="border p-2 w-full h-32" placeholder="Notes" value={notes} onChange={e => setNotes(e.target.value)} />
          <div className="flex gap-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={updateLead}>Save Changes</button>
            <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => setEditMode(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <p><strong>Name:</strong> {lead.name}</p>
          <p><strong>Email:</strong> {lead.email || "-"}</p>
          <p><strong>Phone:</strong> {lead.phone || "-"}</p>
          <p><strong>Status:</strong> {lead.status}</p>
          <p><strong>Source:</strong> {lead.source || "-"}</p>
          <p><strong>Value:</strong> ${lead.value?.toFixed(2)}</p>
          <p><strong>Notes:</strong> {lead.notes || "-"}</p>
          <p><strong>Created At:</strong> {new Date(lead.created_at).toLocaleString()}</p>
          <p><strong>Updated At:</strong> {new Date(lead.updated_at).toLocaleString()}</p>
          {lead.client_id && <p><strong>Client ID:</strong> {lead.client_id}</p>}
          <div className="flex gap-2 mt-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => setEditMode(true)}>Edit Lead</button>
            {lead.status !== "won" && (
              <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={winLead}>Mark as Won & Create Project</button>
            )}
            <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={deleteLead}>Delete Lead</button>
          </div>
        </div>
      )}
      <Link href="/leads" className="text-blue-600 hover:underline mt-4 block">Back to Leads</Link>
    </main>
  )
}