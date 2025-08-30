'use client'
import Link from "next/link"

export default function UiOverview() {
  return (
    <main>
      <h2 className="text-xl font-semibold mb-3">UI Overview</h2>
      <div className="space-y-4">
        <p>This section is for demonstrating various UI components or configurations. The backend `ui.py` router primarily serves server-rendered HTML pages, which are not directly consumed by this Next.js frontend.</p>
        <p>For dynamic data, this Next.js application interacts with dedicated JSON API endpoints for modules like Leads, Clients, Projects, Quotes, Vendors, BOMs, Admin, and Agent.</p>
        <p>You can explore the integrated modules:</p>
        <ul className="list-disc list-inside ml-4">
          <li><Link href="/leads" className="text-blue-600 hover:underline">Leads</Link></li>
          <li><Link href="/clients" className="text-blue-600 hover:underline">Clients</Link></li>
          <li><Link href="/projects" className="text-blue-600 hover:underline">Projects</Link></li>
          <li><Link href="/quotes" className="text-blue-600 hover:underline">Quotes</Link></li>
          <li><Link href="/vendors" className="text-blue-600 hover:underline">Vendors</Link></li>
          <li><Link href="/boms" className="text-blue-600 hover:underline">BOMs</Link></li>
          <li><Link href="/admin" className="text-blue-600 hover:underline">Admin</Link></li>
          <li><Link href="/agent" className="text-blue-600 hover:underline">Agent Assistant</Link></li>
        </ul>
      </div>
    </main>
  )
}