'use client'
import Link from "next/link"

export default function AdminDashboard() {
  return (
    <main>
      <h2 className="text-xl font-semibold mb-3">Admin Dashboard</h2>
      <div className="space-y-4">
        <Link href="/admin/users" className="block bg-blue-600 text-white px-4 py-2 rounded text-center">Manage Users</Link>
        {/* Add other admin links here as modules are integrated */}
      </div>
    </main>
  )
}