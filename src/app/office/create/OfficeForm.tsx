// components/OfficeForm.tsx
'use client'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

export default function OfficeForm() {
  const [offices, setOffices] = useState([])
  const { register, handleSubmit, reset } = useForm()

  useEffect(() => {
    fetch('/api/offices')
      .then(res => res.json())
      .then(data => setOffices(data))
  }, [])

  const onSubmit = async (data) => {
    const res = await fetch('/api/offices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      alert('Office created!')
      reset()
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 border rounded shadow space-y-4">
      <h2 className="text-xl font-bold">Create New Office</h2>

      <div>
        <label className="block font-medium">Office Name</label>
        <input {...register('office_name')} required className="w-full p-2 border rounded" />
      </div>

      <div>
        <label className="block font-medium">Description</label>
        <input {...register('description')} className="w-full p-2 border rounded" />
      </div>

      <div>
        <label className="block font-medium">Parent Office</label>
        <select {...register('parent_office_id')} className="w-full p-2 border rounded">
          <option value="">None</option>
          {offices.map((office) => (
            <option key={office.office_id} value={office.office_id}>
              {office.office_name}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Save
      </button>
    </form>
  )
}
