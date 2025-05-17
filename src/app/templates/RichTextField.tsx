'use client'

import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

interface Props {
  name: string
  value: string
  onChange: (name: string, value: string) => void
}

export default function RichTextField({ name, value, onChange }: Props) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange(name, editor.getHTML())
    }
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '')
    }
  }, [value])

  return (
    <div className="mb-4">
      <label className="block mb-1 capitalize">{name.replace(/_/g, ' ')}</label>
      {editor ? (
        <EditorContent editor={editor} className="border rounded p-2 min-h-[150px] bg-white" />
      ) : (
        <p>Loading editor...</p>
      )}
    </div>
  )
}
