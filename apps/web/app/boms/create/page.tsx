'use client'
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

type Project = {
  id: number;
  name: string;
}

export default function CreateBOMItem() {
  const [projectId, setProjectId] = useState<number | undefined>(undefined)
  const [sku, setSku] = useState("")
  const [name, setName] = useState("")
  const [qty, setQty] = useState(0)
  const [unitCost, setUnitCost] = useState(0)
  const [wastePct, setWastePct] = useState(0)
  const [projects, setProjects] = useState<Project[]>([])
  const router = useRouter()

  const token = typeof window !== 'undefined' ? localStorage.getItem("access") : ""
  const api = process.env.NEXT_PUBLIC_API_URL

  const loadProjects = async () => {
    const res = await fetch(api + "/projects", {
      headers: { "Authorization": "Bearer " + token, "X-Tenant-ID": "1" }
    })
    setProjects(await res.json())
  }

  useEffect(() => {
    loadProjects()
  }, [])

  const createBOMItem = async () => {
    await fetch(api + "/boms", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token, "X-Tenant-ID": "1" },
      body: JSON.stringify({ 
        project_id: projectId, 
        sku: sku || undefined, 
        name, 
        qty, 
        unit_cost: unitCost, 
        waste_pct: wastePct 
      })
    })
    router.push("/boms")
  }

  return (
    <main className="space-y-4">
      <h2 className="text-xl font-semibold mb-3">Add New BOM Item</h2>
      
      <select className="border p-2 w-full" value={projectId || ""} onChange={e => setProjectId(e.target.value ? parseInt(e.target.value) : undefined)}>
        <option value="">Select Project</option>
        {projects.map(project => (
          <option key={project.id} value={project.id}>{project.name}</option>
        ))}
      </select>

      <input className="border p-2 w-full" placeholder="Item Name" value={name} onChange={e => setName(e.target.value)} />
      <input className="border p-2 w-full" placeholder="SKU (optional)" value={sku} onChange={e => setSku(e.target.value)} />
      <input className="border p-2 w-full" type="number" placeholder="Quantity" value={qty} onChange={e => setQty(parseFloat(e.target.value))} />
      <input className="border p-2 w-full" type="number" placeholder="Unit Cost" value={unitCost} onChange={e => setUnitCost(parseFloat(e.target.value))} />
      <input className="border p-2 w-full" type="number" placeholder="Waste Percentage" value={wastePct} onChange={e => setWastePct(parseFloat(e.target.value))} />
      
      <button className="bg-black text-white px-4 py-2 rounded" onClick={createBOMItem}>Add BOM Item</button>
      <Link href="/boms" className="text-blue-600 hover:underline mt-4 block">Back to BOMs</Link>
    </main>
  )
}