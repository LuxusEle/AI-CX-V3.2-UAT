'use client'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

type Vendor = {
  id: number;
  name: string;
  contact?: string;
  payment_terms?: string;
}

export default function VendorDetails({ params }: { params: { id: string } }) {
  const vendorId = params.id
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [name, setName] = useState("")
  const [contact, setContact] = useState("")
  const [paymentTerms, setPaymentTerms] = useState("")
  const router = useRouter()

  const token = typeof window !== 'undefined' ? localStorage.getItem("access") : ""
  const api = process.env.NEXT_PUBLIC_API_URL

  const loadVendor = async () => {
    const res = await fetch(api + "/vendors/" + vendorId, {
      headers: { "Authorization": "Bearer " + token, "X-Tenant-ID": "1" }
    })
    const data = await res.json()
    setVendor(data)
    setName(data.name)
    setContact(data.contact || "")
    setPaymentTerms(data.payment_terms || "")
  }

  useEffect(() => {
    loadVendor()
  }, [vendorId])

  const updateVendor = async () => {
    await fetch(api + "/vendors/" + vendorId, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token, "X-Tenant-ID": "1" },
      body: JSON.stringify({ name, contact, payment_terms: paymentTerms })
    })
    setEditMode(false)
    loadVendor()
  }

  const deleteVendor = async () => {
    if (confirm("Are you sure you want to delete this vendor?")) {
      await fetch(api + "/vendors/" + vendorId, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token, "X-Tenant-ID": "1" }
      })
      router.push("/vendors")
    }
  }

  if (!vendor) return <div>Loading...</div>

  return (
    <main className="space-y-4">
      <h2 className="text-xl font-semibold mb-3">Vendor Details: {vendor.name}</h2>

      {editMode ? (
        <div className="space-y-3">
          <input className="border p-2 w-full" placeholder="Vendor Name" value={name} onChange={e => setName(e.target.value)} />
          <input className="border p-2 w-full" placeholder="Contact Person/Info (optional)" value={contact} onChange={e => setContact(e.target.value)} />
          <input className="border p-2 w-full" placeholder="Payment Terms (e.g., Net 30, Due on Receipt)" value={paymentTerms} onChange={e => setPaymentTerms(e.target.value)} />
          <div className="flex gap-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={updateVendor}>Save Changes</button>
            <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => setEditMode(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <p><strong>Name:</strong> {vendor.name}</p>
          <p><strong>Contact:</strong> {vendor.contact || "-"}</p>
          <p><strong>Payment Terms:</strong> {vendor.payment_terms || "-"}</p>
          <div className="flex gap-2 mt-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => setEditMode(true)}>Edit Vendor</button>
            <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={deleteVendor}>Delete Vendor</button>
          </div>
        </div>
      )}
      <Link href="/vendors" className="text-blue-600 hover:underline mt-4 block">Back to Vendors</Link>
    </main>
  )
}