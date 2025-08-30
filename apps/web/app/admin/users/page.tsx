'use client'
import { useEffect, useState } from "react"
import Link from "next/link"

type User = {
  id: number;
  email: string;
  role: string;
  tenant_id: number;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const token = typeof window !== 'undefined' ? localStorage.getItem("access") : ""
  const api = process.env.NEXT_PUBLIC_API_URL

  const loadUsers = async () => {
    const res = await fetch(api + "/admin/users", {
      headers: { "Authorization": "Bearer " + token, "X-Tenant-ID": "1" }
    })
    setUsers(await res.json())
  }

  useEffect(() => {
    loadUsers()
  }, [])

  return (
    <main>
      <h2 className="text-xl font-semibold mb-3">Manage Users</h2>
      <ul className="space-y-2">
        {users.map(user => (
          <li key={user.id} className="p-3 border rounded bg-white flex justify-between items-center">
            <div>
              <Link href={`/admin/users/${user.id}`} className="text-blue-600 hover:underline font-medium">{user.email}</Link>
              <p className="text-sm text-gray-600">Role: {user.role}</p>
              <p className="text-sm text-gray-600">Tenant ID: {user.tenant_id}</p>
            </div>
            <Link href={`/admin/users/${user.id}`} className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm">View/Edit</Link>
          </li>
        ))}
      </ul>
    </main>
  )
}