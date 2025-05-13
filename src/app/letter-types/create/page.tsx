'use client'

import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function CreateLetterType() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data: any) => {
    setLoading(true)
    try {
      const res = await fetch('/api/letter-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        router.push('/letter-types')
      } else {
        console.error('Failed to create letter type')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-xl font-bold">Create New Letter Type</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium">Type Name</label>
          <input
            {...register('type_name', { required: true })}
            className="border w-full px-3 py-2 rounded"
          />
          {errors.type_name && <span className="text-red-600">Type name is required</span>}
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea
            {...register('description')}
            className="border w-full px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              {...register('is_active')}
              className="mr-2"
              defaultChecked
            />
            Active
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  )
}
