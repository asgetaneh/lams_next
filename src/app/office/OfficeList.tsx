// components/OfficeList.tsx
'use client'
import { useEffect, useState } from 'react'

export default function OfficeList() {
  const [offices, setOffices] = useState([])
  const [filters, setFilters] = useState({ parent: '', name: '' })

  useEffect(() => {
    fetch(`/api/offices?name=${filters.name}&status=${filters.parent}`)
      .then(res => res.json())
      .then(data => setOffices(data))
  }, [filters])

  useEffect(() => {
    fetch('/api/offices')
      .then(res => res.json())
      .then(data => setOffices(data))
  }, [])

  return (
    <div className="space-y-12">
    <h4 className="text-2xl font-bold">📥 Office List 
       <a
          href="/office/create"
          className="inline-flex items-center gap-2 bg-blue-300 text-white px-2 py-1 rounded hover:bg-blue-200 transition float-right"
      >
          ➕ Create office
      </a>
      </h4>

    {/* Filter Form */}
    <form
      onSubmit={e => {
        e.preventDefault()
      }}
      className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded shadow"
    >
      <input
        type="text"
        placeholder="Search subject..."
        value={filters.name}
        onChange={e => setFilters({ ...filters, name: e.target.value })}
        className="border p-2 rounded"
      />
      <select
        value={filters.parent}
        onChange={e => setFilters({ ...filters, parent: e.target.value })}
        className="border p-2 rounded"
      >
        <option value="">All Statuses</option>
        <option value="draft">Draft</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>
      <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700">
        Filter
      </button>
    </form>

    <div className="overflow-x-auto bg-white shadow rounded">
    <h2 className="text-xl font-bold mb-4">Office List</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Parent Office</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Created</th>
          </tr>
        </thead>
        <tbody>
          {offices.map((office) => (
            <tr key={office.office_id}>
              <td className="p-2 border">{office.office_name}</td>
              <td className="p-2 border">{office.parent?.office_name || '—'}</td>
              <td className="p-2 border">{office.description || '—'}</td>
              <td className="p-2 border">{new Date(office.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>

  )
}
