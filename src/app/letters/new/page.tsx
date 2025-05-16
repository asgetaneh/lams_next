'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function NewLetterPage() {
  const searchParams = useSearchParams()
  const templateId = searchParams.get('template')
  
  const [formData, setFormData] = useState({
    recipient_name: '',
    date: new Date().toISOString().split('T')[0],
    sender_name: '',
    title: '',
    content: '',
    number: ''
  })

  const [template, setTemplate] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch template when component mounts or templateId changes
  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        if (!templateId) {
          setError('No template selected')
          setLoading(false)
          return
        }

        const res = await fetch(`/api/templates/${templateId}`)
        console.log("Template response:", res)
        if (!res.ok) throw new Error('Failed to fetch template')
        
        const data = await res.json()
        setTemplate(data)
        
        // Initialize form with template's default values if any
        if (data.defaultValues) {
          setFormData(prev => ({
            ...prev,
            ...data.defaultValues
          }))
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTemplate()
  }, [templateId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const generateLetter = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/letters/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template_id: templateId,
          data: formData
        }),
      })
      
      if (!res.ok) throw new Error('Generation failed')
      
      const result = await res.json()
      
      // Download the generated letter
      if (result.downloadUrl) {
        window.open(result.downloadUrl, '_blank')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading template...</div>
  if (error) return <div>Error: {error}</div>
  if (!template) return <div>Template not found</div>

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Create New Letter</h2>
        <Link href="/templates" className="text-blue-600 hover:underline">
          ← Back to templates
        </Link>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-2">Template: {template.template_name}</h3>
        <p className="text-gray-600">{template.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form Section */}
        <div className="space-y-4">
          {template.placeholders?.map((placeholder: string) => (
            <div key={placeholder}>
              <label className="block mb-1 capitalize">
                {placeholder.replace(/_/g, ' ')}
              </label>
              {placeholder === 'content' ? (
                <textarea
                  name={placeholder}
                  value={formData[placeholder] || ''}
                  onChange={handleChange}
                  rows={4}
                  className="border p-2 w-full rounded"
                />
              ) : (
                <input
                  type={placeholder === 'date' ? 'date' : 'text'}
                  name={placeholder}
                  value={formData[placeholder] || ''}
                  onChange={handleChange}
                  className="border p-2 w-full rounded"
                />
              )}
            </div>
          ))}
        </div>

        {/* Preview Section */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Preview</h3>
          <div className="bg-white p-8 border rounded-lg shadow-inner">
            <div dangerouslySetInnerHTML={{
              __html: template.html_content.replace(
                /{{(\w+)}}/g, 
                (match: string, p1: string) => formData[p1] || `<span class="text-gray-400">[${p1}]</span>`
              )
            }} />
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <button
          onClick={generateLetter}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate Letter'}
        </button>
      </div>
    </div>
  )
}