
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return new NextResponse(JSON.stringify({ message: 'All fields are required' }), { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return new NextResponse(JSON.stringify({ message: 'User already exists' }), { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    return new NextResponse(JSON.stringify({ message: 'User created successfully' }), { status: 201 })
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: 'Something went wrong' }), { status: 500 })
  }
}
