'use client'
import { useEffect, useState } from "react"
import Link from "next/link"

type PurchaseOrder = {
  id: number;
  vendor_id?: number;
  project_id?: number;
  status: string;
  total: number;
}

type Vendor = {
  id: number;
  name: string;
}

type Project = {
  id: number;
  name: string;
}

export default function PurchaseOrders() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([])
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [projects, setProjects] = useState<Project[]>([])
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

  const loadPurchaseOrders = async () => {
    const res = await fetch(api + "/pos", {
      headers: { "Authorization": "Bearer " + token, "X-Tenant-ID": "1" }
    })
    setPurchaseOrders(await res.json())
  }

  useEffect(() => {
    loadVendorsAndProjects()
    loadPurchaseOrders()
  }, [])

  const getVendorName = (vendorId?: number) => {
    return vendors.find(v => v.id === vendorId)?.name || "N/A"
  }

  const getProjectName = (projectId?: number) => {
    return projects.find(p => p.id === projectId)?.name || "N/A"
  }

  return (
    <main>
      <h2 className="text-xl font-semibold mb-3">Purchase Orders</h2>
      <div className="mb-4">
        <Link href="/pos/create" className="bg-black text-white px-4 py-2 rounded">Create New Purchase Order</Link>
      </div>
      <ul className="space-y-2">
        {purchaseOrders.map(po => (
          <li key={po.id} className="p-3 border rounded bg-white flex justify-between items-center">
            <div>
              <Link href={`/pos/${po.id}`} className="text-blue-600 hover:underline font-medium">PO #{po.id}</Link>
              <p className="text-sm text-gray-600">Vendor: {getVendorName(po.vendor_id)}</p>
              <p className="text-sm text-gray-600">Project: {getProjectName(po.project_id)}</p>
              <p className="text-sm text-gray-600">Status: {po.status} | Total: ${po.total?.toFixed(2)}</p>
            </div>
            <Link href={`/pos/${po.id}`} className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm">View/Edit</Link>
          </li>
        ))}
      </ul>
    </main>
  )
}