'use client'
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CreateLead() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [source, setSource] = useState("")
  const [value, setValue] = useState(0.0)
  const [notes, setNotes] = useState("")
  const router = useRouter()

  const token = typeof window !== 'undefined' ? localStorage.getItem("access") : ""
  const api = process.env.NEXT_PUBLIC_API_URL

  const createLead = async () => {
    await fetch(api + "/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token, "X-Tenant-ID": "1" },
      body: JSON.stringify({ name, email, phone, source, value, notes })
    })
    router.push("/leads")
  }

  return (
    <main className="space-y-4">
      <h2 className="text-xl font-semibold mb-3">Create New Lead</h2>
      <input className="border p-2 w-full" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
      <input className="border p-2 w-full" type="email" placeholder="Email (optional)" value={email} onChange={e => setEmail(e.target.value)} />
      <input className="border p-2 w-full" type="tel" placeholder="Phone (optional)" value={phone} onChange={e => setPhone(e.target.value)} />
      <input className="border p-2 w-full" placeholder="Source (e.g., Web, Referral)" value={source} onChange={e => setSource(e.target.value)} />
      <input className="border p-2 w-full" type="number" placeholder="Estimated Value" value={value} onChange={e => setValue(parseFloat(e.target.value))} />
      <textarea className="border p-2 w-full h-32" placeholder="Notes (optional)" value={notes} onChange={e => setNotes(e.target.value)} />
      <button className="bg-black text-white px-4 py-2 rounded" onClick={createLead}>Create Lead</button>
    </main>
  )
}