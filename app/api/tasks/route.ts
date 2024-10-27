import { NextRequest, NextResponse } from 'next/server';
import Task from '../../../models/Task';

// Named export for the GET method
export async function GET(request: NextRequest) {
  try {
    const tasks = await Task.findAll();
    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({
        error_code: 'get_tasks',
        message: error.message,
      }, { status: 500 });
    } else {
      return NextResponse.json({
        error_code: 'get_tasks',
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
        { error: 'Task title is required' },
        { status: 400 }
      );
    }
    const newTask = await Task.create({title: title});
    return NextResponse.json(newTask, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({
        error_code: 'create_task_error',
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
