"use client"

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const RichTextEditor = dynamic(() => import('@/app/templates/RichTextEditor'), { ssr: false })

export default function NewLetterPage() {
  const searchParams = useSearchParams()
  const templateId = searchParams.get('template')

  const [formData, setFormData] = useState<Record<string, any>>({})
  const [template, setTemplate] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        if (!templateId) {
          setError('No template selected')
          setLoading(false)
          return
        }

        const res = await fetch(`/api/templates/${templateId}`)
        if (!res.ok) throw new Error('Failed to fetch template')

        const data = await res.json()
        setTemplate(data)

        const initialValues = data.placeholders.reduce((acc: any, key: string) => {
          if (isImagePlaceholder(key)) {
            acc[key] = { value: '', width: '', height: '', align: 'inline' }
          } else {
            acc[key] = ''  // plain string for text placeholders
          }
          return acc
        }, {})



        setFormData(initialValues)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTemplate()
  }, [templateId])

 const handleChange = (name: string, value: any, field?: string) => {
  if (field) {
    // For image placeholders (object)
    setFormData((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        [field]: value,
      },
    }))
  } else {
    // For simple string placeholders (text inputs or rich text)
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }
}



  const isImagePlaceholder = (key: string) => /logo|stamp|signature|ti-tor|image/i.test(key)

  const renderInput = (key: string) => {
    if (isImagePlaceholder(key)) {
  return (
    <div key={key} className="border p-4 rounded space-y-2 bg-gray-50">
      <label className="block mb-1 font-medium capitalize">{key.replace(/_/g, ' ')}</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) {
            const reader = new FileReader()
            reader.onload = () => handleChange(key, reader.result, 'value')
            reader.readAsDataURL(file)
          }
        }}
      />

      <div className="grid grid-cols-2 gap-2">
        <input
          type="text"
          placeholder="Width (e.g. 150px or 50%)"
          className="border p-2 rounded"
          value={formData[key]?.width || ''}
          onChange={(e) => handleChange(key, e.target.value, 'width')}
        />
        <input
          type="text"
          placeholder="Height (e.g. 100px)"
          className="border p-2 rounded"
          value={formData[key]?.height || ''}
          onChange={(e) => handleChange(key, e.target.value, 'height')}
        />
      </div>

      <select
        className="border p-2 rounded w-full"
        value={formData[key]?.align || 'inline'}
        onChange={(e) => handleChange(key, e.target.value, 'align')}
      >
        <option value="inline">Inline</option>
        <option value="left">Float Left</option>
        <option value="right">Float Right</option>
        <option value="center">Center</option>
      </select>
    </div>
  )
}


    if (/content|body|header|title/i.test(key)) {
      return (
        <div key={key}>
          <label className="block mb-1 capitalize">{key.replace(/_/g, ' ')}</label>
          <RichTextEditor
            content={formData[key]}
            onChange={(html: string) => handleChange(key, html)}
          />
        </div>
      )
    }

    return (
      <div key={key}>
        <label className="block mb-1 capitalize">{key.replace(/_/g, ' ')}</label>
        <input
          type={key === 'date' ? 'date' : 'text'}
          name={key}
          value={formData[key] || ''}
          onChange={(e) => handleChange(key, e.target.value)}
          className="border p-2 w-full rounded"
        />
      </div>
    )
  }

  const renderPreview = () => {
    if (!template?.html_content) return null
    let content = template.html_content

    content = content.replace(/{{(\w+)}}/g, (_, key) => {
      const value = formData[key]
      
      if (isImagePlaceholder(key) && value?.value) {
        const width = value.width || 'auto'
        const height = value.height || 'auto'
        const align = value.align || 'inline'

        let style = `max-height:200px; width:${width}; height:${height};`
        if (align === 'left') style += ' float:left; margin-right:10px;'
        else if (align === 'right') style += ' float:right; margin-left:10px;'
        else if (align === 'center') style += ' display:block; margin:auto;'

        return `<img src="${value.value}" alt="${key}" style="${style}" />`
      }

      // For text placeholders, value is a string
      if (/content|body|header|title|ti-tor/i.test(key) && typeof value === 'string') {
        return value
      }

      return value || `<span class='text-gray-400'>[${key}]</span>`
    })



    return <div dangerouslySetInnerHTML={{ __html: content }} />
  }

  if (loading) return <div>Loading template...</div>
  if (error) return <div className="text-red-600">Error: {error}</div>

  return (
    <div className="p-6 max-w-6xl mx-auto">
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
        <div className="space-y-4">
          {template.placeholders?.map((placeholder: string) => renderInput(placeholder))}
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Preview</h3>
          <div className="bg-white p-4 border rounded shadow-inner overflow-auto">
            {renderPreview()}
          </div>
        </div>
      </div>
    </div>
  )
}
