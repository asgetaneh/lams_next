import { PrismaClient } from "@prisma/client";
import { hashPassword } from "@/lib/hash";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { username, full_name,email, password } = await req.json();

  const exists = await prisma.users.findUnique({ where: { email } });
  if (exists) return NextResponse.json({ error: "User exists" }, { status: 400 });

  const hashed = await hashPassword(password);
  await prisma.users.create({ data: { username, full_name, email, password_hash: hashed } });

  return NextResponse.json({ success: true });
}
