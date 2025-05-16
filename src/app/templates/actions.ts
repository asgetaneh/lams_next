'use server';

import prisma  from '@/lib/prisma';
import { redirect } from 'next/navigation';

export async function createTemplate(formData: FormData) {
  const name = formData.get('name') as string;
  const content = formData.get('content') as string;

  await prisma.templates.create({
    data: {
      template_name: name,
      html_content: content,
    },
  });

  redirect('/templates');
}

export async function updateTemplate(id: string, formData: FormData) {
  const name = formData.get('name') as string;
  const content = formData.get('content') as string;

  await prisma.templates.update({
    where: { template_id: id },
    data: {
      template_name: name,
      html_content: content,
    },
  });

  redirect('/templates');
}
export async function deleteTemplate(id: string) {
  await prisma.templates.delete({
    where: { template_id: id },
  });

  redirect('/templates');
}