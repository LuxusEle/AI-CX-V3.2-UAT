'use client'
import { useEffect, useState } from "react"
import Link from "next/link"

type Vendor = {
  id: number;
  name: string;
  contact?: string;
  payment_terms?: string;
}

export default function Vendors() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const token = typeof window !== 'undefined' ? localStorage.getItem("access") : ""
  const api = process.env.NEXT_PUBLIC_API_URL

  const loadVendors = async () => {
    const res = await fetch(api + "/vendors", {
      headers: { "Authorization": "Bearer " + token, "X-Tenant-ID": "1" }
    })
    setVendors(await res.json())
  }

  useEffect(() => {
    loadVendors()
  }, [])

  return (
    <main>
      <h2 className="text-xl font-semibold mb-3">Vendors</h2>
      <div className="mb-4">
        <Link href="/vendors/create" className="bg-black text-white px-4 py-2 rounded">Create New Vendor</Link>
      </div>
      <ul className="space-y-2">
        {vendors.map(vendor => (
          <li key={vendor.id} className="p-3 border rounded bg-white flex justify-between items-center">
            <div>
              <Link href={`/vendors/${vendor.id}`} className="text-blue-600 hover:underline font-medium">{vendor.name}</Link>
              <p className="text-sm text-gray-600">Contact: {vendor.contact || "-"}</p>
              <p className="text-sm text-gray-600">Payment Terms: {vendor.payment_terms || "-"}</p>
            </div>
            <Link href={`/vendors/${vendor.id}`} className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm">View/Edit</Link>
          </li>
        ))}
      </ul>
    </main>
  )
}