import { NextResponse } from 'next/server'
import  prisma  from '@/lib/prisma' // Update path as needed

export async function POST(req: Request) {
  const data = await req.json()
  console.log('New letter created0:', data)
  console.log('Received Data:', JSON.stringify(data, null, 2))
  try {
    const newLetter = await prisma.letters.create({ data })
    console.log('New letter created:', newLetter)
    return NextResponse.json(newLetter)
  } catch (err) {
    console.error(err)
    process.on('uncaughtException', (err) => {
      console.error('Uncaught Exception:', err);
    });
    
    return NextResponse.json({ error: 'Failed to create letter' }, { status: 500 })
  }
}


