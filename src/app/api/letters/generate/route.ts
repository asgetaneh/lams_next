import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import Handlebars from 'handlebars'
import { renderToStaticMarkup } from 'react-dom/server'
import { PDFDocument } from 'pdf-lib'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { template_id, data } = await request.json()
    
    // Get template
    const template = await prisma.templates.findUnique({
      where: { template_id }
    })

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    // Compile template
    const compiled = Handlebars.compile(template.html_content)
    const htmlContent = compiled(data)

    // Generate PDF (using pdf-lib as an example)
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([595, 842]) // A4 dimensions in points
    // ... add your PDF generation logic here ...

    const pdfBytes = await pdfDoc.save()

    // Save to database
    const letter = await prisma.letters.create({
      data: {
        template_id,
        content: htmlContent,
        status: 'generated',
        // ... other fields
      }
    })

    // Return both HTML and PDF
    return NextResponse.json({
      success: true,
      letter,
      downloadUrl: `/api/letters/download/${letter.letter_id}`
    })

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}