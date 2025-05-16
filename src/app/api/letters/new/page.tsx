// app/letters/new/page.tsx
'use client'

import { useState } from 'react'

export default function NewLetterPage() {
  const [formData, setFormData] = useState({
    recipient_name: '',
    date: '',
  })

  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const generateLetter = async () => {
    setLoading(true)
    const res = await fetch('/api/letters/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        template_id: 'your-template-id', // Replace with real ID
        subject: 'Sample Letter',
        created_by: 'user-id', // Replace with real user ID
        data: formData,
      }),
    })

    const result = await res.json()
    setPreview(result.letter?.html_content || 'Error generating letter')
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Generate Letter from Template</h2>

      <input
        name="recipient_name"
        onChange={handleChange}
        placeholder="Recipient Name"
        className="border p-2 mb-3 w-full"
      />
      <input
        name="date"
        onChange={handleChange}
        placeholder="Date"
        className="border p-2 mb-3 w-full"
      />

      <button
        onClick={generateLetter}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate Letter'}
      </button>

      <h3 className="mt-6 text-lg font-semibold">Letter Preview:</h3>
      <div
        className="border p-4 mt-2"
        dangerouslySetInnerHTML={{ __html: preview }}
      />
    </div>
  )
}
