import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { letter_type_id, template_name, html_content } = req.body;

    const template = await prisma.templates.create({
      data: {
        letter_type_id,
        template_name,
        html_content,
      },
      include: {
        letter_type: true,
      },
    });

    res.status(201).json(template);
  } catch (error) {
    console.error('Error creating template:', error);
    res.status(500).json({ message: 'Error creating template' });
  } finally {
    await prisma.$disconnect();
  }
}