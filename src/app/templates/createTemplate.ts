'use server';

import  prisma  from '@/lib/prisma';

export async function createTemplate(data: { name: string; content: string }) {
  await prisma.templates.create({
    data: {
      name: data.name,
      content: data.content,
    },
  });
}
