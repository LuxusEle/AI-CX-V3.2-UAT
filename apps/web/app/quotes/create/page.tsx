'use client'
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

type Client = {
  id: number;
  name: string;
}

type Project = {
  id: number;
  name: string;
}

type QuoteLineInput = {
  description: string;
  unit_price: number;
  qty: number;
}

export default function CreateQuote() {
  const [projectId, setProjectId] = useState<number | undefined>(undefined)
  const [clientId, setClientId] = useState<number | undefined>(undefined)
  const [number, setNumber] = useState("")
  const [issueDate, setIssueDate] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [currency, setCurrency] = useState("LKR")
  const [notes, setNotes] = useState("")
  const [lines, setLines] = useState<QuoteLineInput[]>([{ description: "", unit_price: 0, qty: 1 }])
  const [clients, setClients] = useState<Client[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const router = useRouter()

  const token = typeof window !== 'undefined' ? localStorage.getItem("access") : ""
  const api = process.env.NEXT_PUBLIC_API_URL

  const loadClientsAndProjects = async () => {
    const clientRes = await fetch(api + "/clients", {
      headers: { "Authorization": "Bearer " + token, "X-Tenant-ID": "1" }
    })
    setClients(await clientRes.json())

    const projectRes = await fetch(api + "/projects", {
      headers: { "Authorization": "Bearer " + token, "X-Tenant-ID": "1" }
    })
    setProjects(await projectRes.json())
  }

  useEffect(() => {
    loadClientsAndProjects()
  }, [])

  const handleAddLine = () => {
    setLines([...lines, { description: "", unit_price: 0, qty: 1 }])
  }

  const handleRemoveLine = (index: number) => {
    const newLines = [...lines]
    newLines.splice(index, 1)
    setLines(newLines)
  }

  const handleLineChange = (index: number, field: keyof QuoteLineInput, value: string | number) => {
    const newLines = [...lines]
    if (field === "unit_price" || field === "qty") {
      newLines[index][field] = parseFloat(value as string) || 0
    } else {
      newLines[index][field] = value as string
    }
    setLines(newLines)
  }

  const createQuote = async () => {
    const payload = {
      project_id: projectId,
      client_id: clientId,
      number: number || undefined,
      issue_date: issueDate || undefined,
      due_date: dueDate || undefined,
      currency,
      notes: notes || undefined,
      lines: lines.filter(line => line.description && line.unit_price > 0 && line.qty > 0)
    }

    const res = await fetch(api + "/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token, "X-Tenant-ID": "1" },
      body: JSON.stringify(payload)
    })
    const newQuote = await res.json()
    alert(`Created quote ${newQuote.number || newQuote.id}.`)
    router.push("/quotes")
  }

  return (
    <main className="space-y-4">
      <h2 className="text-xl font-semibold mb-3">Create New Quote</h2>
      
      <input className="border p-2 w-full" placeholder="Quote Number (optional)" value={number} onChange={e => setNumber(e.target.value)} />
      
      <select className="border p-2 w-full" value={clientId || ""} onChange={e => setClientId(e.target.value ? parseInt(e.target.value) : undefined)}>
        <option value="">Select Client (optional)</option>
        {clients.map(client => (
          <option key={client.id} value={client.id}>{client.name}</option>
        ))}
      </select>

      <select className="border p-2 w-full" value={projectId || ""} onChange={e => setProjectId(e.target.value ? parseInt(e.target.value) : undefined)}>
        <option value="">Select Project (optional)</option>
        {projects.map(project => (
          <option key={project.id} value={project.id}>{project.name}</option>
        ))}
      </select>

      <input className="border p-2 w-full" type="date" placeholder="Issue Date (optional)" value={issueDate} onChange={e => setIssueDate(e.target.value)} />
      <input className="border p-2 w-full" type="date" placeholder="Due Date (optional)" value={dueDate} onChange={e => setDueDate(e.target.value)} />
      <input className="border p-2 w-full" placeholder="Currency" value={currency} onChange={e => setCurrency(e.target.value)} />
      <textarea className="border p-2 w-full h-24" placeholder="Notes (optional)" value={notes} onChange={e => setNotes(e.target.value)} />

      <h3 className="text-lg font-semibold mt-4">Quote Lines</h3>
      {lines.map((line, index) => (
        <div key={index} className="flex gap-2 items-center">
          <input className="border p-2 flex-1" placeholder="Description" value={line.description} onChange={e => handleLineChange(index, "description", e.target.value)} />
          <input className="border p-2 w-24" type="number" placeholder="Unit Price" value={line.unit_price} onChange={e => handleLineChange(index, "unit_price", e.target.value)} />
          <input className="border p-2 w-16" type="number" placeholder="Qty" value={line.qty} onChange={e => handleLineChange(index, "qty", e.target.value)} />
          <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleRemoveLine(index)}>Remove</button>
        </div>
      ))}
      <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleAddLine}>Add Line</button>

      <button className="bg-black text-white px-4 py-2 rounded mt-4" onClick={createQuote}>Create Quote</button>
      <Link href="/quotes" className="text-blue-600 hover:underline mt-4 block">Back to Quotes</Link>
    </main>
  )
}