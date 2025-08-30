'use client'
import { useEffect, useState } from "react"
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

export default function BOMs() {
  const [bomItems, setBomItems] = useState<BOMItem[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<number | undefined>(undefined)
  const token = typeof window !== 'undefined' ? localStorage.getItem("access") : ""
  const api = process.env.NEXT_PUBLIC_API_URL

  const loadProjects = async () => {
    const res = await fetch(api + "/projects", {
      headers: { "Authorization": "Bearer " + token, "X-Tenant-ID": "1" }
    })
    setProjects(await res.json())
  }

  const loadBomItems = async (projectId?: number) => {
    let url = api + "/boms"
    if (projectId) {
      url += `?project_id=${projectId}`
    }
    const res = await fetch(url, {
      headers: { "Authorization": "Bearer " + token, "X-Tenant-ID": "1" }
    })
    setBomItems(await res.json())
  }

  useEffect(() => {
    loadProjects()
    loadBomItems() // Load all BOMs initially
  }, [])

  useEffect(() => {
    loadBomItems(selectedProjectId)
  }, [selectedProjectId])

  return (
    <main>
      <h2 className="text-xl font-semibold mb-3">Bill of Materials</h2>
      <div className="mb-4 flex gap-2 items-center">
        <Link href="/boms/create" className="bg-black text-white px-4 py-2 rounded">Add New BOM Item</Link>
        <select className="border p-2 rounded" value={selectedProjectId || ""} onChange={e => setSelectedProjectId(e.target.value ? parseInt(e.target.value) : undefined)}>
          <option value="">All Projects</option>
          {projects.map(project => (
            <option key={project.id} value={project.id}>{project.name}</option>
          ))}
        </select>
      </div>
      <ul className="space-y-2">
        {bomItems.map(item => (
          <li key={item.id} className="p-3 border rounded bg-white flex justify-between items-center">
            <div>
              <Link href={`/boms/${item.id}`} className="text-blue-600 hover:underline font-medium">{item.name}</Link>
              <p className="text-sm text-gray-600">Project ID: {item.project_id} | SKU: {item.sku || "-"}</p>
              <p className="text-sm text-gray-600">Qty: {item.qty} | Unit Cost: ${item.unit_cost?.toFixed(2)} | Waste: {item.waste_pct}%</p>
            </div>
            <Link href={`/boms/${item.id}`} className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm">View/Edit</Link>
          </li>
        ))}
      </ul>
    </main>
  )
}