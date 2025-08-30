'use client'
import { useEffect, useState } from "react"
import Link from "next/link"

type Project = {
  id: number;
  name: string;
  client_id?: number;
  status: string;
  start_date?: string;
  end_date?: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const token = typeof window !== 'undefined' ? localStorage.getItem("access") : ""
  const api = process.env.NEXT_PUBLIC_API_URL

  const loadProjects = async () => {
    const res = await fetch(api + "/projects", {
      headers: { "Authorization": "Bearer " + token, "X-Tenant-ID": "1" }
    })
    setProjects(await res.json())
  }

  useEffect(() => {
    loadProjects()
  }, [])

  return (
    <main>
      <h2 className="text-xl font-semibold mb-3">Projects</h2>
      <div className="mb-4">
        <Link href="/projects/create" className="bg-black text-white px-4 py-2 rounded">Create New Project</Link>
      </div>
      <ul className="space-y-2">
        {projects.map(project => (
          <li key={project.id} className="p-3 border rounded bg-white flex justify-between items-center">
            <div>
              <Link href={`/projects/${project.id}`} className="text-blue-600 hover:underline font-medium">{project.name}</Link>
              <p className="text-sm text-gray-600">Status: {project.status}</p>
              {project.start_date && <p className="text-sm text-gray-600">Start Date: {new Date(project.start_date).toLocaleDateString()}</p>}
              {project.end_date && <p className="text-sm text-gray-600">End Date: {new Date(project.end_date).toLocaleDateString()}</p>}
            </div>
            <Link href={`/projects/${project.id}`} className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm">View/Edit</Link>
          </li>
        ))}
      </ul>
    </main>
  )
}