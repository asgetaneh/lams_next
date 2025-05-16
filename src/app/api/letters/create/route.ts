// /pages/letters/new.tsx
'use client'
import { useState } from 'react'
import axios from 'axios'

export default function NewLetter() {
  const [data, setData] = useState({ recipient_name: '', date: '' })
  const [htmlContent, setHtmlContent] = useState('')

  const handleChange = (e: any) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    const res = await axios.post('/api/letters/generate', {
      template_id: 'your-template-id',
      subject: 'Welcome Letter',
      created_by: 'user-id',
      data
    })

    setHtmlContent(res.data.letter.html_content)
  }

  return (
    <div>
      <h2>Create Letter</h2>
      <input name="recipient_name" placeholder="Recipient Name" onChange={handleChange} />
      <input name="date" placeholder="Date" onChange={handleChange} />
      <button onClick={handleSubmit}>Generate</button>

      <h3>Preview:</h3>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  )
}
