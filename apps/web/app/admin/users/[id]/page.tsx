'use client'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

type User = {
  id: number;
  email: string;
  role: string;
  tenant_id: number;
}

export default function UserDetails({ params }: { params: { id: string } }) {
  const userId = params.id
  const [user, setUser] = useState<User | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("")
  const router = useRouter()

  const token = typeof window !== 'undefined' ? localStorage.getItem("access") : ""
  const api = process.env.NEXT_PUBLIC_API_URL

  const loadUser = async () => {
    const res = await fetch(api + "/admin/users/" + userId, {
      headers: { "Authorization": "Bearer " + token, "X-Tenant-ID": "1" }
    })
    const data = await res.json()
    setUser(data)
    setEmail(data.email)
    setRole(data.role)
  }

  useEffect(() => {
    loadUser()
  }, [userId])

  const updateUser = async () => {
    await fetch(api + "/admin/users/" + userId, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token, "X-Tenant-ID": "1" },
      body: JSON.stringify({ email, role })
    })
    setEditMode(false)
    loadUser()
  }

  const deleteUser = async () => {
    if (confirm("Are you sure you want to delete this user?")) {
      await fetch(api + "/admin/users/" + userId, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token, "X-Tenant-ID": "1" }
      })
      router.push("/admin/users")
    }
  }

  if (!user) return <div>Loading...</div>

  return (
    <main className="space-y-4">
      <h2 className="text-xl font-semibold mb-3">User Details: {user.email}</h2>

      {editMode ? (
        <div className="space-y-3">
          <input className="border p-2 w-full" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <select className="border p-2 w-full" value={role} onChange={e => setRole(e.target.value)}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="agent">Agent</option>
          </select>
          <div className="flex gap-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={updateUser}>Save Changes</button>
            <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => setEditMode(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Tenant ID:</strong> {user.tenant_id}</p>
          <div className="flex gap-2 mt-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => setEditMode(true)}>Edit User</button>
            <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={deleteUser}>Delete User</button>
          </div>
        </div>
      )}
      <Link href="/admin/users" className="text-blue-600 hover:underline mt-4 block">Back to Users</Link>
    </main>
  )
}