import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

interface CustomJwtPayload {
  id?: number;
  email?: string;
  password?: string;
}

export async function POST(req: NextRequest) {
  try {

    dotenv.config();

    const { refreshToken } = await req.json();

    const secret = process.env.JWT_SECRET;

    if(!refreshToken) {
      return NextResponse.json({ error: 'refreshToken is required.' }, { status: 401 });
    }

    const decoded = jwt.verify(refreshToken, secret!) as CustomJwtPayload;

    // Generate a JWT for the session
    const token = jwt.sign({ id: decoded.id, email: decoded.email, password: decoded.password }, process.env.JWT_SECRET!, { expiresIn: '1m' });

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
