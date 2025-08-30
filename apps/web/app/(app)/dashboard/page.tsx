'use client'
import { useEffect, useState } from "react"

type LeadStatusCount = {
  status: string;
  count: number;
}

type LeadSummary = {
  total_leads: number;
  leads_by_status: LeadStatusCount[];
}

export default function Dashboard() {
  const [apiStatus, setApiStatus] = useState("...")
  const [leadSummary, setLeadSummary] = useState<LeadSummary | null>(null)
  const token = typeof window !== 'undefined' ? localStorage.getItem("access") : ""
  const api = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    // Fetch API health status
    fetch(api + "/health")
      .then(r => r.json())
      .then(j => setApiStatus(j.status))
      .catch(() => setApiStatus("down"))

    // Fetch lead summary
    fetch(api + "/leads/summary", {
      headers: { "Authorization": "Bearer " + token, "X-Tenant-ID": "1" }
    })
      .then(r => r.json())
      .then(data => setLeadSummary(data))
      .catch(error => console.error("Failed to fetch lead summary:", error))
  }, [])

  return (
    <main>
      <h2 className="text-xl font-semibold mb-3">Dashboard</h2>
      <div className="p-4 border rounded bg-white mb-4">API status: {apiStatus}</div>

      {leadSummary && (
        <div className="p-4 border rounded bg-white">
          <h3 className="text-lg font-semibold mb-2">Lead Summary</h3>
          <p>Total Leads: {leadSummary.total_leads}</p>
          <h4 className="font-medium mt-3">Leads by Status:</h4>
          <ul className="list-disc list-inside">
            {leadSummary.leads_by_status.map((item, index) => (
              <li key={index}>{item.status}: {item.count}</li>
            ))}
          </ul>
        </div>
      )}
    </main>
  )
}
