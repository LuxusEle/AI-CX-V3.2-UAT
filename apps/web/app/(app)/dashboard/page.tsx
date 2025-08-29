'use client'
import { useEffect, useState } from "react"

export default function Dashboard() {
  const [status, setStatus] = useState("...")
  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_URL + "/health").then(r=>r.json()).then(j=>setStatus(j.status)).catch(()=>setStatus("down"))
  }, [])
  return (
    <main>
      <h2 className="text-xl font-semibold mb-3">Dashboard</h2>
      <div className="p-4 border rounded bg-white">API status: {status}</div>
    </main>
  )
}
