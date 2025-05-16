// src/actions/updateTemplate.ts
'use server';

import  prisma  from '@/lib/prisma';
import { redirect } from 'next/navigation';// src/actions/updateTemplate.ts
 
export async function updateTemplateAction(id: string, formData: FormData) {
  const name = formData.get('name') as string;
  const content = formData.get('content') as string;

  await prisma.templates.update({
    where: { template_id: id },
    data: {
      template_name: name,
      html_content: content,
    },
  });

  redirect('/templates'); // or return something instead
}

