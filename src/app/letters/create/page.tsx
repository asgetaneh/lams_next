'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateLetterPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    letter_type_id: '',
    template_id: '',
    creator_id: '',
    subject: '',
    content: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/letters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        router.push('/letters/inbox')
      } else {
        console.error('Create failed')
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">📄 Create New Letter</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Letter Type</label>
          <select
            name="letter_type_id"
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Type</option>
            <option value="type1">Type 1</option>
            <option value="type2">Type 2</option>
            {/* TODO: Load dynamically */}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Template</label>
          <select
            name="template_id"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">None</option>
            <option value="template1">Template 1</option>
            <option value="template2">Template 2</option>
            {/* TODO: Load dynamically */}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Creator</label>
          <select
            name="creator_id"
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Creator</option>
            <option value="user1">User 1</option>
            <option value="user2">User 2</option>
            {/* TODO: Load dynamically */}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Subject</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Content</label>
          <textarea
            name="content"
            rows={6}
            value={formData.content}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Save Letter
        </button>
      </form>
    </div>
  )
}
