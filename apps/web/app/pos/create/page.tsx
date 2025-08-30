'use client'
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

type Vendor = {
  id: number;
  name: string;
}

type Project = {
  id: number;
  name: string;
}

export default function CreatePurchaseOrder() {
  const [vendorId, setVendorId] = useState<number | undefined>(undefined)
  const [projectId, setProjectId] = useState<number | undefined>(undefined)
  const [status, setStatus] = useState("draft")
  const [total, setTotal] = useState(0)
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const router = useRouter()

  const token = typeof window !== 'undefined' ? localStorage.getItem("access") : ""
  const api = process.env.NEXT_PUBLIC_API_URL

  const loadVendorsAndProjects = async () => {
    const vendorRes = await fetch(api + "/vendors", {
      headers: { "Authorization": "Bearer " + token, "X-Tenant-ID": "1" }
    })
    setVendors(await vendorRes.json())

    const projectRes = await fetch(api + "/projects", {
      headers: { "Authorization": "Bearer " + token, "X-Tenant-ID": "1" }
    })
    setProjects(await projectRes.json())
  }

  useEffect(() => {
    loadVendorsAndProjects()
  }, [])

  const createPurchaseOrder = async () => {
    await fetch(api + "/pos", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token, "X-Tenant-ID": "1" },
      body: JSON.stringify({ 
        vendor_id: vendorId, 
        project_id: projectId, 
        status, 
        total 
      })
    })
    router.push("/pos")
  }

  return (
    <main className="space-y-4">
      <h2 className="text-xl font-semibold mb-3">Create New Purchase Order</h2>
      
      <select className="border p-2 w-full" value={vendorId || ""} onChange={e => setVendorId(e.target.value ? parseInt(e.target.value) : undefined)}>
        <option value="">Select Vendor (optional)</option>
        {vendors.map(vendor => (
          <option key={vendor.id} value={vendor.id}>{vendor.name}</option>
        ))}
      </select>

      <select className="border p-2 w-full" value={projectId || ""} onChange={e => setProjectId(e.target.value ? parseInt(e.target.value) : undefined)}>
        <option value="">Select Project (optional)</option>
        {projects.map(project => (
          <option key={project.id} value={project.id}>{project.name}</option>
        ))}
      </select>

      <select className="border p-2 w-full" value={status} onChange={e => setStatus(e.target.value)}>
        <option value="draft">Draft</option>
        <option value="pending">Pending</option>
        <option value="issued">Issued</option>
        <option value="received">Received</option>
        <option value="cancelled">Cancelled</option>
      </select>

      <input className="border p-2 w-full" type="number" placeholder="Total Amount" value={total} onChange={e => setTotal(parseFloat(e.target.value))} />
      
      <button className="bg-black text-white px-4 py-2 rounded" onClick={createPurchaseOrder}>Create Purchase Order</button>
      <Link href="/pos" className="text-blue-600 hover:underline mt-4 block">Back to Purchase Orders</Link>
    </main>
  )
}