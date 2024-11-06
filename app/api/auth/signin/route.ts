import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

export async function POST(req: NextRequest) {
  try {

    dotenv.config();

    const { email, password } = await req.json();
    
    // Find the user with the given email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: 'No user, Register first' }, { status: 401 });
    }

    // Compare the password with the stored hashed password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json({ error: 'Password is not correct' }, { status: 401 });
    }

    // Generate a JWT for the session
    const token = jwt.sign({ id: user.id, email: user.email, password }, process.env.JWT_SECRET!, { expiresIn: '1m' });


    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
