import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { subject, status } = req.query

  const letters = await prisma.letters.findMany({
    where: {
      subject: subject ? { contains: String(subject), mode: 'insensitive' } : undefined,
      status: status ? String(status) : undefined,
    },
    orderBy: { created_at: 'desc' },
    take: 50,
  })

  res.json(letters)
}
