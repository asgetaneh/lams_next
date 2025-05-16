import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const templateId = parseInt(params.id);
  const formData = await req.formData();

  const template_name = formData.get('template_name')?.toString() || '';
  const letter_type_id = parseInt(formData.get('letter_type_id')?.toString() || '');
  const html_content = formData.get('html_content')?.toString() || '';

  if (!template_name || !letter_type_id || !html_content) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  await prisma.templates.update({
    where: { template_id: templateId },
    data: {
      template_name,
      letter_type_id,
      html_content,
    },
  });

  return NextResponse.redirect(new URL('/templates', req.url));
}
