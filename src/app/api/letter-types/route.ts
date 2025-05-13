import { NextResponse } from 'next/server'
import prisma  from '@/lib/prisma'

/**
 * GET /api/letter-types
 * Fetch all letter types
 */
export async function GET() {
  try {
    const letterTypes = await prisma.letter_Types.findMany({
      orderBy: { created_at: 'desc' },
    })
    return NextResponse.json(letterTypes)
  } catch (error) {
    console.error('Error fetching letter types:', error)
    return NextResponse.json({ error: 'Failed to fetch letter types' }, { status: 500 })
  }
}

/**
 * POST /api/letter-types
 * Create a new letter type
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const newLetterType = await prisma.letter_Types.create({
      data: {
        type_name: body.type_name,
        description: body.description || '',
        is_active: body.is_active ?? true,
      },
    })

    return NextResponse.json(newLetterType, { status: 201 })
  } catch (error: any) {
    console.error('Error creating letter type:', error)

    if (error.code === 'P2002') {
      // Prisma unique constraint error (type_name already exists)
      return NextResponse.json(
        { error: 'A letter type with this name already exists.' },
        { status: 409 }
      )
    }

    return NextResponse.json({ error: 'Failed to create letter type' }, { status: 500 })
  }
}
