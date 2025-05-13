'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'

type LetterType = {
  letter_type_id: string
  type_name: string
  description?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function LetterTypesPage() {
  const { register, handleSubmit, reset } = useForm()
  const [letterTypes, setLetterTypes] = useState<LetterType[]>([])
  const [filtered, setFiltered] = useState<LetterType[]>([])

  useEffect(() => {
    fetch('/api/letter-types')
      .then((res) => res.json())
      .then((data) => {
        setLetterTypes(data)
        setFiltered(data)
      })
  }, [])

  const onSearch = (data: any) => {
    const keyword = data.keyword?.toLowerCase() || ''
    const result = letterTypes.filter((lt) =>
      lt.type_name.toLowerCase().includes(keyword)
    )
    setFiltered(result)
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Letter Types</h1>
        <Link
          href="/letter-types/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Create New
        </Link>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSubmit(onSearch)} className="flex gap-2">
        <input
          {...register('keyword')}
          type="text"
          placeholder="Search by type name..."
          className="border px-3 py-2 rounded w-64"
        />
        <button
          type="submit"
          className="bg-gray-700 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </form>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Type Name</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Active</th>
              <th className="p-2 border">Created At</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((lt) => (
              <tr key={lt.letter_type_id} className="hover:bg-gray-50">
                <td className="p-2 border">{lt.type_name}</td>
                <td className="p-2 border">{lt.description || '-'}</td>
                <td className="p-2 border">
                  {lt.is_active ? 'Yes' : 'No'}
                </td>
                <td className="p-2 border">
                  {new Date(lt.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-4 text-gray-500">No results found.</div>
        )}
      </div>
    </div>
  )
}
