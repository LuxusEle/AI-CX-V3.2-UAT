'use client'
import { useEffect, useState } from "react"
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

type PurchaseOrder = {
  id: number;
  vendor_id?: number;
  project_id?: number;
  status: string;
  total: number;
}

export default function PurchaseOrderDetails({ params }: { params: { id: string } }) {
  const poId = params.id
  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrder | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [vendorId, setVendorId] = useState<number | undefined>(undefined)
  const [projectId, setProjectId] = useState<number | undefined>(undefined)
  const [status, setStatus] = useState("")
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

  const loadPurchaseOrder = async () => {
    const res = await fetch(api + "/pos/" + poId, {
      headers: { "Authorization": "Bearer " + token, "X-Tenant-ID": "1" }
    })
    const data = await res.json()
    setPurchaseOrder(data)
    setVendorId(data.vendor_id || undefined)
    setProjectId(data.project_id || undefined)
    setStatus(data.status)
    setTotal(data.total)
  }

  useEffect(() => {
    loadVendorsAndProjects()
    loadPurchaseOrder()
  }, [poId])

  const updatePurchaseOrder = async () => {
    await fetch(api + "/pos/" + poId, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token, "X-Tenant-ID": "1" },
      body: JSON.stringify({ 
        vendor_id: vendorId, 
        project_id: projectId, 
        status, 
        total 
      })
    })
    setEditMode(false)
    loadPurchaseOrder()
  }

  const deletePurchaseOrder = async () => {
    if (confirm("Are you sure you want to delete this Purchase Order?")) {
      await fetch(api + "/pos/" + poId, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token, "X-Tenant-ID": "1" }
      })
      router.push("/pos")
    }
  }

  const getVendorName = (id?: number) => {
    return vendors.find(v => v.id === id)?.name || "N/A"
  }

  const getProjectName = (id?: number) => {
    return projects.find(p => p.id === id)?.name || "N/A"
  }

  if (!purchaseOrder) return <div>Loading...</div>

  return (
    <main className="space-y-4">
      <h2 className="text-xl font-semibold mb-3">Purchase Order Details: PO #{purchaseOrder.id}</h2>

      {editMode ? (
        <div className="space-y-3">
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
          
          <div className="flex gap-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={updatePurchaseOrder}>Save Changes</button>
            <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => setEditMode(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <p><strong>Vendor:</strong> {getVendorName(purchaseOrder.vendor_id)}</p>
          <p><strong>Project:</strong> {getProjectName(purchaseOrder.project_id)}</p>
          <p><strong>Status:</strong> {purchaseOrder.status}</p>
          <p><strong>Total:</strong> ${purchaseOrder.total?.toFixed(2)}</p>
          <div className="flex gap-2 mt-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => setEditMode(true)}>Edit Purchase Order</button>
            <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={deletePurchaseOrder}>Delete Purchase Order</button>
          </div>
        </div>
      )}
      <Link href="/pos" className="text-blue-600 hover:underline mt-4 block">Back to Purchase Orders</Link>
    </main>
  )
}