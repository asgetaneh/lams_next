import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createReport } from 'docx-templates';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const { letter_type_id, template_name } = Object.fromEntries(formData);

  // Read the Word template file
  const buffer = Buffer.from(await file.arrayBuffer());

  // Extract placeholders (e.g., scan for <<placeholders>> in the DOCX)
  const placeholders = await extractPlaceholders(buffer);

  // Save to database
  const template = await prisma.templates.create({
    data: {
      letter_type_id: letter_type_id as string,
      template_name: template_name as string,
      docx_template: buffer,
      placeholders,
    },
  });

  return NextResponse.json(template);
}

// Helper: Extract placeholders from DOCX
async function extractPlaceholders(buffer: Buffer): Promise<string[]> {
  const { placeholderRegex = /<<([^>>]+)>>/g } = require('docx-templates');
  const report = await createReport({
    template: buffer,
    data: {}, // No data, just scanning
    cmdDelimiter: ['<<', '>>'],
  });
  return [...new Set(report.logs.map((log: string) => log.match(placeholderRegex)).flat())];
}