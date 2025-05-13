// app/api/offices/route.ts (or under /pages/api if using pages router)
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  const offices = await prisma.offices.findMany({
    include: { parent: true },
    orderBy: { created_at: 'desc' }
  })
  return NextResponse.json(offices)
}

export async function POST(req: Request) {
  const body = await req.json()
  const newOffice = await prisma.offices.create({
    data: {
      office_name: body.office_name,
      parent_office_id: body.parent_office_id || null,
      description: body.description || null,
    }
  })
  return NextResponse.json(newOffice)
}
