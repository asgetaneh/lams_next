'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
    FaFilter, FaFolderOpen, FaArchive, FaUsers,
    FaSignInAlt, FaUserPlus, FaChevronDown, FaChevronRight, FaFileAlt
  } from 'react-icons/fa'

type Letter = {
  letter_id: string
  subject: string
  status: string
  created_at: string
}

export default function LetterInbox() {
  const [letters, setLetters] = useState<Letter[]>([])
  const [filters, setFilters] = useState({ status: '', subject: '' })

  useEffect(() => {
    fetch(`/api/letters?subject=${filters.subject}&status=${filters.status}`)
      .then(res => res.json())
      .then(data => setLetters(data))
  }, [filters])

  return (
    <div className="space-y-12">
      <h4 className="text-2xl font-bold">📥 Letter Inbox 
         <a
            href="/letters/create"
            className="inline-flex items-center gap-2 bg-blue-300 text-white px-2 py-1 rounded hover:bg-blue-200 transition float-right"
        >
            ➕ Create Letter
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
          value={filters.subject}
          onChange={e => setFilters({ ...filters, subject: e.target.value })}
          className="border p-2 rounded"
        />
        <select
          value={filters.status}
          onChange={e => setFilters({ ...filters, status: e.target.value })}
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
      

      {/* Smart Table */}
      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Subject</th>
              <th className="p-3">Status</th>
              <th className="p-3">Created At</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {letters.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center p-4 text-gray-500">
                  No letters found.
                </td>
              </tr>
            ) : (
              letters.map(letter => (
                <tr key={letter.letter_id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{letter.subject}</td>
                  <td className="p-3 capitalize">{letter.status}</td>
                  <td className="p-3">{new Date(letter.created_at).toLocaleDateString()}</td>
                  <td className="p-3">
                    <Link href={`/letters/${letter.letter_id}`} className="text-blue-600 hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
