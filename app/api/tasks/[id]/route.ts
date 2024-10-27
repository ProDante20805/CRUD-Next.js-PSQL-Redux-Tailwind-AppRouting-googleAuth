import { NextRequest, NextResponse } from 'next/server';
import Task from '../../../../models/Task';

// Delete task by ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const taskId = params.id;
    const deletedCount = await Task.destroy({
      where: { id: Number(taskId) },
    });

    if (deletedCount === 0) {
      return NextResponse.json(
        { error: `Task with ID ${taskId} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: `Task with ID ${taskId} deleted successfully` }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error_code: 'delete_task_error',
          message: error.message,
        },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        {
          error_code: 'unexpected_error',
          message: 'An unexpected error occurred',
        },
        { status: 500 }
      );
    }
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const taskId = params.id;
        const { title } = await request.json();

        if(!title) {
            return NextResponse.json(
                { error: 'Name is required' },
                { status: 400 }
            );
        }

        const [updatedCount] = await Task.update(
            { title },
            { where: { id: Number(taskId) } }
        );

        if (updatedCount === 0) {
            return NextResponse.json(
                { error: `Task with Id ${taskId} not found` },
                { status: 404 }
            );
        }

        const updatedTask = await Task.findByPk(Number(taskId));
        return NextResponse.json(updatedTask, { status: 200 });
    } catch (error: unknown) {
        if(error instanceof Error) {
            return NextResponse.json(
                { 
                    error_code: 'update_task_error',
                    message: error.message,
                },
                { status: 500 }
            );
        } else {
            return NextResponse.json(
                { 
                    error_code: 'unexpected_error',
                    message: 'An unexpected error occurred',
                },
                { status: 500 }
            )
        }
    }
}
