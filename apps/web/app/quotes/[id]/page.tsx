'use client'
import { useEffect, useState } from "react"
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

type QuoteLine = {
  id?: number; // Optional for new lines
  description: string;
  unit_price: number;
  qty: number;
  line_total?: number; // Optional for input, calculated by backend
}

type Quote = {
  id: number;
  project_id?: number;
  client_id?: number;
  number?: string;
  issue_date?: string;
  due_date?: string;
  currency: string;
  subtotal: number;
  total: number;
  notes?: string;
  lines: QuoteLine[];
}

export default function QuoteDetails({ params }: { params: { id: string } }) {
  const quoteId = params.id
  const [quote, setQuote] = useState<Quote | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [projectId, setProjectId] = useState<number | undefined>(undefined)
  const [clientId, setClientId] = useState<number | undefined>(undefined)
  const [number, setNumber] = useState("")
  const [issueDate, setIssueDate] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [currency, setCurrency] = useState("")
  const [notes, setNotes] = useState("")
  const [lines, setLines] = useState<QuoteLine[]>([])
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

  const loadQuote = async () => {
    const res = await fetch(api + "/quotes/" + quoteId, {
      headers: { "Authorization": "Bearer " + token, "X-Tenant-ID": "1" }
    })
    const data = await res.json()
    setQuote(data)
    setProjectId(data.project_id || undefined)
    setClientId(data.client_id || undefined)
    setNumber(data.number || "")
    setIssueDate(data.issue_date || "")
    setDueDate(data.due_date || "")
    setCurrency(data.currency)
    setNotes(data.notes || "")
    setLines(data.lines || [])
  }

  useEffect(() => {
    loadClientsAndProjects()
    loadQuote()
  }, [quoteId])

  const handleAddLine = () => {
    setLines([...lines, { description: "", unit_price: 0, qty: 1 }])
  }

  const handleRemoveLine = (index: number) => {
    const newLines = [...lines]
    newLines.splice(index, 1)
    setLines(newLines)
  }

  const handleLineChange = (index: number, field: keyof QuoteLine, value: string | number) => {
    const newLines = [...lines]
    if (field === "description") {
      newLines[index][field] = value as string
    } else if (field === "unit_price" || field === "qty") {
      newLines[index][field] = parseFloat(value as string) || 0
    }
    setLines(newLines)
  }

  const updateQuote = async () => {
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

    await fetch(api + "/quotes/" + quoteId, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token, "X-Tenant-ID": "1" },
      body: JSON.stringify(payload)
    })
    setEditMode(false)
    loadQuote()
  }

  const deleteQuote = async () => {
    if (confirm("Are you sure you want to delete this quote?")) {
      await fetch(api + "/quotes/" + quoteId, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token, "X-Tenant-ID": "1" }
      })
      router.push("/quotes")
    }
  }

  const openPdf = async () => {
    window.open(api + "/quotes/" + quoteId + "/pdf", "_blank")
  }

  if (!quote) return <div>Loading...</div>

  return (
    <main className="space-y-4">
      <h2 className="text-xl font-semibold mb-3">Quote Details: {quote.number || `Quote #${quote.id}`}</h2>

      {editMode ? (
        <div className="space-y-3">
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

          <div className="flex gap-2 mt-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={updateQuote}>Save Changes</button>
            <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => setEditMode(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <p><strong>Number:</strong> {quote.number || "-"}</p>
          <p><strong>Client ID:</strong> {quote.client_id || "-"}</p>
          <p><strong>Project ID:</strong> {quote.project_id || "-"}</p>
          <p><strong>Issue Date:</strong> {quote.issue_date ? new Date(quote.issue_date).toLocaleDateString() : "-"}</p>
          <p><strong>Due Date:</strong> {quote.due_date ? new Date(quote.due_date).toLocaleDateString() : "-"}</p>
          <p><strong>Currency:</strong> {quote.currency}</p>
          <p><strong>Subtotal:</strong> {quote.currency}{quote.subtotal?.toFixed(2)}</p>
          <p><strong>Total:</strong> {quote.currency}{quote.total?.toFixed(2)}</p>
          <p><strong>Notes:</strong> {quote.notes || "-"}</p>

          <h3 className="text-lg font-semibold mt-4">Quote Lines</h3>
          {quote.lines.length > 0 ? (
            <ul className="list-disc list-inside">
              {quote.lines.map(line => (
                <li key={line.id}>
                  {line.description} - {line.qty} x {quote.currency}{line.unit_price?.toFixed(2)} = {quote.currency}{line.line_total?.toFixed(2)}
                </li>
              ))}
            </ul>
          ) : (
            <p>No lines for this quote.</p>
          )}

          <div className="flex gap-2 mt-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => setEditMode(true)}>Edit Quote</button>
            <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={openPdf}>Open PDF</button>
            <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={deleteQuote}>Delete Quote</button>
          </div>
        </div>
      )}
      <Link href="/quotes" className="text-blue-600 hover:underline mt-4 block">Back to Quotes</Link>
    </main>
  )
}