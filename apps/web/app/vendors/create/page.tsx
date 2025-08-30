'use client'
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function CreateVendor() {
  const [name, setName] = useState("")
  const [contact, setContact] = useState("")
  const [paymentTerms, setPaymentTerms] = useState("")
  const router = useRouter()

  const token = typeof window !== 'undefined' ? localStorage.getItem("access") : ""
  const api = process.env.NEXT_PUBLIC_API_URL

  const createVendor = async () => {
    await fetch(api + "/vendors", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token, "X-Tenant-ID": "1" },
      body: JSON.stringify({ name, contact, payment_terms: paymentTerms })
    })
    router.push("/vendors")
  }

  return (
    <main className="space-y-4">
      <h2 className="text-xl font-semibold mb-3">Create New Vendor</h2>
      <input className="border p-2 w-full" placeholder="Vendor Name" value={name} onChange={e => setName(e.target.value)} />
      <input className="border p-2 w-full" placeholder="Contact Person/Info (optional)" value={contact} onChange={e => setContact(e.target.value)} />
      <input className="border p-2 w-full" placeholder="Payment Terms (e.g., Net 30, Due on Receipt)" value={paymentTerms} onChange={e => setPaymentTerms(e.target.value)} />
      <button className="bg-black text-white px-4 py-2 rounded" onClick={createVendor}>Create Vendor</button>
      <Link href="/vendors" className="text-blue-600 hover:underline mt-4 block">Back to Vendors</Link>
    </main>
  )
}