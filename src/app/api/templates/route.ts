import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma'; // Adjust path as needed

// Handle POST request
export async function POST(request: Request) {
  try {
    const { letter_type_id, template_name, html_content } = await request.json();

    const newTemplate = await prisma.templates.create({
      data: {
        letter_type_id,
        template_name,
        html_content,
      },
    });

    return NextResponse.json(newTemplate, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create template' }, { status: 500 });
  }
}

// Optionally, handle GET requests if needed
export async function GET() {
  try {
    const templates = await prisma.templates.findMany();
    return NextResponse.json(templates);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
  }
}


