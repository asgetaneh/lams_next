// app/api/letters/route.ts
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { letter_type_id, creator_id, content } = await req.json()

  try {
    const letter = await prisma.letters.create({
      data: {
        letter_type_id,
        creator_id,
        content,
        status: 'draft'
      }
    })
    return NextResponse.json(letter)
  } catch (error) {
    return NextResponse.json(
      { error: 'Letter creation failed' },
      { status: 500 }
    )
  }
}