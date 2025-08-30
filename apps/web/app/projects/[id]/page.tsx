'use client'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

type Project = {
  id: number;
  name: string;
  client_id?: number;
  status: string;
  start_date?: string;
  end_date?: string;
}

type Client = {
  id: number;
  name: string;
}

type PriceBomResult = {
  subtotal_cost: number;
  suggested_total: number;
  margin_pct: number;
}

type SplitPosResult = {
  created_po_ids: number[];
}

export default function ProjectDetails({ params }: { params: { id: string } }) {
  const projectId = params.id
  const [project, setProject] = useState<Project | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [name, setName] = useState("")
  const [clientId, setClientId] = useState<number | undefined>(undefined)
  const [status, setStatus] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [clients, setClients] = useState<Client[]>([])
  const [priceBomResult, setPriceBomResult] = useState<PriceBomResult | null>(null)
  const [splitPosResult, setSplitPosResult] = useState<SplitPosResult | null>(null)
  const router = useRouter()

  const token = typeof window !== 'undefined' ? localStorage.getItem("access") : ""
  const api = process.env.NEXT_PUBLIC_API_URL

  const loadClients = async () => {
    const res = await fetch(api + "/clients", {
      headers: { "Authorization": "Bearer " + token, "X-Tenant-ID": "1" }
    })
    setClients(await res.json())
  }

  const loadProject = async () => {
    const res = await fetch(api + "/projects/" + projectId, {
      headers: { "Authorization": "Bearer " + token, "X-Tenant-ID": "1" }
    })
    const data = await res.json()
    setProject(data)
    setName(data.name)
    setClientId(data.client_id || undefined)
    setStatus(data.status)
    setStartDate(data.start_date || "")
    setEndDate(data.end_date || "")
  }

  useEffect(() => {
    loadClients()
    loadProject()
  }, [projectId])

  const updateProject = async () => {
    await fetch(api + "/projects/" + projectId, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token, "X-Tenant-ID": "1" },
      body: JSON.stringify({
        name,
        client_id: clientId,
        status,
        start_date: startDate || null,
        end_date: endDate || null
      })
    })
    setEditMode(false)
    loadProject()
  }

  const deleteProject = async () => {
    if (confirm("Are you sure you want to delete this project?")) {
      await fetch(api + "/projects/" + projectId, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token, "X-Tenant-ID": "1" }
      })
      router.push("/projects")
    }
  }

  const priceBom = async () => {
    try {
      const res = await fetch(api + `/workflows/projects/${projectId}/bom/price`, {
        headers: { "Authorization": "Bearer " + token, "X-Tenant-ID": "1" }
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.detail || "Failed to price BOM")
      }
      const data = await res.json()
      setPriceBomResult(data)
    } catch (error: any) {
      alert(error.message)
      setPriceBomResult(null)
    }
  }

  const splitPos = async () => {
    if (!confirm("Are you sure you want to split BOM into Purchase Orders?")) return
    try {
      const res = await fetch(api + `/workflows/projects/${projectId}/bom/split-pos`, {
        method: "POST",
        headers: { "Authorization": "Bearer " + token, "X-Tenant-ID": "1" }
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.detail || "Failed to split POs")
      }
      const data = await res.json()
      setSplitPosResult(data)
      alert(`Created ${data.created_po_ids.length} POs: ${data.created_po_ids.join(", ")}`)
    } catch (error: any) {
      alert(error.message)
      setSplitPosResult(null)
    }
  }

  if (!project) return <div>Loading...</div>

  return (
    <main className="space-y-4">
      <h2 className="text-xl font-semibold mb-3">Project Details: {project.name}</h2>

      {editMode ? (
        <div className="space-y-3">
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
          
          <div className="flex gap-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={updateProject}>Save Changes</button>
            <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => setEditMode(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <p><strong>Name:</strong> {project.name}</p>
          <p><strong>Client ID:</strong> {project.client_id || "-"}</p>
          <p><strong>Status:</strong> {project.status}</p>
          <p><strong>Start Date:</strong> {project.start_date ? new Date(project.start_date).toLocaleDateString() : "-"}</p>
          <p><strong>End Date:</strong> {project.end_date ? new Date(project.end_date).toLocaleDateString() : "-"}</p>
          
          <div className="flex gap-2 mt-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => setEditMode(true)}>Edit Project</button>
            <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={deleteProject}>Delete Project</button>
          </div>

          <h3 className="text-lg font-semibold mt-4">Workflows</h3>
          <div className="flex gap-2">
            <button className="bg-purple-600 text-white px-4 py-2 rounded" onClick={priceBom}>Price BOM</button>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded" onClick={splitPos}>Split POs from BOM</button>
          </div>

          {priceBomResult && (
            <div className="p-3 border rounded bg-gray-50 mt-3">
              <h4 className="font-medium">BOM Pricing Result:</h4>
              <p>Subtotal Cost: ${priceBomResult.subtotal_cost?.toFixed(2)}</p>
              <p>Suggested Total: ${priceBomResult.suggested_total?.toFixed(2)}</p>
              <p>Margin: {priceBomResult.margin_pct}%</p>
            </div>
          )}

          {splitPosResult && (
            <div className="p-3 border rounded bg-gray-50 mt-3">
              <h4 className="font-medium">Split POs Result:</h4>
              <p>Created PO IDs: {splitPosResult.created_po_ids.join(", ")}</p>
            </div>
          )}
        </div>
      )}
      <Link href="/projects" className="text-blue-600 hover:underline mt-4 block">Back to Projects</Link>
    </main>
  )
}