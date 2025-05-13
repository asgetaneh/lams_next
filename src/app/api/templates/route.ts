// File: app/api/templates/route.ts
import  prisma  from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const newTemplate = await prisma.templates.create({
      data: {
        template_name: body.template_name,
        letter_type_id: body.letter_type_id,
        html_content: body.html_content,
      },
    })
    return NextResponse.json(newTemplate, { status: 201 })
  } catch (error) {
    console.error('Error creating template:', error)
    return NextResponse.json({ error: 'Failed to create template' }, { status: 500 })
  }
}
