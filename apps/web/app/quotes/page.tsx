'use client'
import { useEffect, useState } from "react"

type Quote = { id: number; number: string; subtotal: number; total: number; currency: string }

export default function Quotes() {
  const [items, setItems] = useState<Quote[]>([])
  const [desc, setDesc] = useState("Pantry Cupboard Specifications")
  const [unit, setUnit] = useState(1390000)
  const [qty, setQty] = useState(1)

  const token = typeof window !== 'undefined' ? localStorage.getItem("access") : ""
  const api = process.env.NEXT_PUBLIC_API_URL

  const load = async () => {
    // naive load by reusing projects endpoint? For brevity, we won't list; focus on create and PDF
  }

  const createQuote = async () => {
    const res = await fetch(api + "/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token, "X-Tenant-ID": "1" },
      body: JSON.stringify({ lines: [{ description: desc, unit_price: unit, qty }] })
    })
    const j = await res.json()
    alert("Created quote " + j.number + ". Now open PDF.")
    setItems([j, ...items])
  }

  const openPdf = async (id: number) => {
    window.open(api + "/quotes/" + id + "/pdf", "_blank")
  }

  return (
    <main>
      <h2 className="text-xl font-semibold mb-3">Quotes</h2>
      <div className="p-4 border rounded bg-white mb-4 flex gap-2">
        <input className="border p-2 flex-1" placeholder="description" value={desc} onChange={e=>setDesc(e.target.value)} />
        <input className="border p-2 w-32" type="number" placeholder="unit" value={unit} onChange={e=>setUnit(parseFloat(e.target.value))} />
        <input className="border p-2 w-24" type="number" placeholder="qty" value={qty} onChange={e=>setQty(parseFloat(e.target.value))} />
        <button className="bg-black text-white px-3" onClick={createQuote}>Create + PDF</button>
      </div>
      <ul className="space-y-2">
        {items.map(q => (
          <li key={q.id} className="p-3 border rounded bg-white flex justify-between">
            <div>{q.number} — {q.currency}{q.total?.toFixed?.(2)}</div>
            <button className="underline" onClick={()=>openPdf(q.id)}>Open PDF</button>
          </li>
        ))}
      </ul>
    </main>
  )
}
