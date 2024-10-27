import { NextRequest, NextResponse } from 'next/server';
import User from '../../../models/User';

// Named export for the GET method
export async function GET(request: NextRequest) {
  try {
    const users = await User.findAll();
    return NextResponse.json({ users }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({
        error_code: 'get_users',
        message: error.message,
      }, { status: 500 });
    } else {
      return NextResponse.json({
        error_code: 'get_users',
        message: 'An unexpected error occurred',
      }, { status: 500 });
    }
  }
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { title } = await req.json();
    if(!title) {
      return NextResponse.json(
        { error: 'User title is required' },
        { status: 400 }
      );
    }
    const newUser = await User.create({title: title});
    return NextResponse.json(newUser, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({
        error_code: 'create_user_error',
        message: error.message,
      }, { status: 500 });
    } else {
      return NextResponse.json({
        error_code: 'unexpected_error',
        message: 'An unexpected error occurred',
      }, { status: 500 });
    }
  }
}

// No default export; instead, each HTTP method is a titled export
