'use client'
import { useEffect, useState } from "react"
import Link from "next/link"

type QuoteLine = {
  id: number;
  description: string;
  unit_price: number;
  qty: number;
  line_total: number;
}

type Quote = {
  id: number;
  number?: string;
  subtotal: number;
  total: number;
  currency: string;
  issue_date?: string;
  due_date?: string;
  client_id?: number;
  project_id?: number;
  notes?: string;
  lines: QuoteLine[];
}

export default function Quotes() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const token = typeof window !== 'undefined' ? localStorage.getItem("access") : ""
  const api = process.env.NEXT_PUBLIC_API_URL

  const loadQuotes = async () => {
    const res = await fetch(api + "/quotes", {
      headers: { "Authorization": "Bearer " + token, "X-Tenant-ID": "1" }
    })
    setQuotes(await res.json())
  }

  useEffect(() => {
    loadQuotes()
  }, [])

  const openPdf = async (id: number) => {
    window.open(api + "/quotes/" + id + "/pdf", "_blank")
  }

  return (
    <main>
      <h2 className="text-xl font-semibold mb-3">Quotes</h2>
      <div className="mb-4">
        <Link href="/quotes/create" className="bg-black text-white px-4 py-2 rounded">Create New Quote</Link>
      </div>
      <ul className="space-y-2">
        {quotes.map(quote => (
          <li key={quote.id} className="p-3 border rounded bg-white flex justify-between items-center">
            <div>
              <Link href={`/quotes/${quote.id}`} className="text-blue-600 hover:underline font-medium">
                {quote.number || `Quote #${quote.id}`}
              </Link>
              <p className="text-sm text-gray-600">Total: {quote.currency}{quote.total?.toFixed(2)}</p>
              {quote.issue_date && <p className="text-sm text-gray-600">Issue Date: {new Date(quote.issue_date).toLocaleDateString()}</p>}
            </div>
            <div className="flex gap-2">
              <button className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm" onClick={() => openPdf(quote.id)}>Open PDF</button>
              <Link href={`/quotes/${quote.id}`} className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm">View/Edit</Link>
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}
