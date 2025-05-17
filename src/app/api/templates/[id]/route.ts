import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const template = await prisma.templates.findUnique({
      where: { template_id: params.id },
    //   include: { letter_type: true }
    });

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...template,
      placeholders: extractPlaceholders(template.html_content)
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Server error', details: error.message },
      { status: 500 }
    );
  }
}

function extractPlaceholders(html: string): string[] {
  const regex = /{{(\w+)}}/g;
  const matches = [];
  let match;
  while ((match = regex.exec(html))) {
    matches.push(match[1]);
  }
  return [...new Set(matches)];
}

// You can add PUT and DELETE methods here too