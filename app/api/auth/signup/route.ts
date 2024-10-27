import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User'; // Adjust the path as necessary
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Hash the password and create a new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
