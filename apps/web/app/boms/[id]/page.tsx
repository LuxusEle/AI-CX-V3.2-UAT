'use client'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

type BOMItem = {
  id: number;
  project_id: number;
  sku?: string;
  name: string;
  qty: number;
  unit_cost: number;
  waste_pct: number;
}

type Project = {
  id: number;
  name: string;
}

export default function BOMItemDetails({ params }: { params: { id: string } }) {
  const bomItemId = params.id
  const [bomItem, setBomItem] = useState<BOMItem | null>(null)
  const [editMode, setEditMode] = useState(false)
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

  const loadBOMItem = async () => {
    const res = await fetch(api + "/boms/" + bomItemId, {
      headers: { "Authorization": "Bearer " + token, "X-Tenant-ID": "1" }
    })
    const data = await res.json()
    setBomItem(data)
    setProjectId(data.project_id || undefined)
    setSku(data.sku || "")
    setName(data.name)
    setQty(data.qty)
    setUnitCost(data.unit_cost)
    setWastePct(data.waste_pct)
  }

  useEffect(() => {
    loadProjects()
    loadBOMItem()
  }, [bomItemId])

  const updateBOMItem = async () => {
    await fetch(api + "/boms/" + bomItemId, {
      method: "PUT",
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
    setEditMode(false)
    loadBOMItem()
  }

  const deleteBOMItem = async () => {
    if (confirm("Are you sure you want to delete this BOM item?")) {
      await fetch(api + "/boms/" + bomItemId, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token, "X-Tenant-ID": "1" }
      })
      router.push("/boms")
    }
  }

  if (!bomItem) return <div>Loading...</div>

  return (
    <main className="space-y-4">
      <h2 className="text-xl font-semibold mb-3">BOM Item Details: {bomItem.name}</h2>

      {editMode ? (
        <div className="space-y-3">
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
          
          <div className="flex gap-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={updateBOMItem}>Save Changes</button>
            <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => setEditMode(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <p><strong>Project ID:</strong> {bomItem.project_id}</p>
          <p><strong>Item Name:</strong> {bomItem.name}</p>
          <p><strong>SKU:</strong> {bomItem.sku || "-"}</p>
          <p><strong>Quantity:</strong> {bomItem.qty}</p>
          <p><strong>Unit Cost:</strong> ${bomItem.unit_cost?.toFixed(2)}</p>
          <p><strong>Waste Percentage:</strong> {bomItem.waste_pct}%</p>
          <div className="flex gap-2 mt-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => setEditMode(true)}>Edit BOM Item</button>
            <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={deleteBOMItem}>Delete BOM Item</button>
          </div>
        </div>
      )}
      <Link href="/boms" className="text-blue-600 hover:underline mt-4 block">Back to BOMs</Link>
    </main>
  )
}