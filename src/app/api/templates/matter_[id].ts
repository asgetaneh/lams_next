import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const template = await prisma.templates.findUnique({
        where: { template_id: id as string },
        include: { letter_type: true },
      });

      if (!template) {
        return res.status(404).json({ message: 'Template not found' });
      }

      res.status(200).json(template);
    } catch (error) {
      console.error('Error fetching template:', error);
      res.status(500).json({ message: 'Error fetching template' });
    }
  } 
  else if (req.method === 'PUT') {
    try {
      const { template_name, html_content } = req.body;

      const updatedTemplate = await prisma.templates.update({
        where: { template_id: id as string },
        data: {
          template_name,
          html_content,
          updated_at: new Date(),
        },
      });

      res.status(200).json(updatedTemplate);
    } catch (error) {
      console.error('Error updating template:', error);
      res.status(500).json({ message: 'Error updating template' });
    }
  }
  else if (req.method === 'DELETE') {
    try {
      await prisma.templates.delete({
        where: { template_id: id as string },
      });

      res.status(204).end();
    } catch (error) {
      console.error('Error deleting template:', error);
      res.status(500).json({ message: 'Error deleting template' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  await prisma.$disconnect();
}