import { NextRequest, NextResponse } from 'next/server';
import User from '../../../../models/User';

// Delete user by ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = params.id;
    const deletedCount = await User.destroy({
      where: { id: Number(userId) },
    });

    if (deletedCount === 0) {
      return NextResponse.json(
        { error: `User with ID ${userId} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: `User with ID ${userId} deleted successfully` }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error_code: 'delete_user_error',
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
        const userId = params.id;
        const { title } = await request.json();

        if(!title) {
            return NextResponse.json(
                { error: 'Name is required' },
                { status: 400 }
            );
        }

        const [updatedCount] = await User.update(
            { title },
            { where: { id: Number(userId) } }
        );

        if (updatedCount === 0) {
            return NextResponse.json(
                { error: `User with Id ${userId} not found` },
                { status: 404 }
            );
        }

        const updatedUser = await User.findByPk(Number(userId));
        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error: unknown) {
        if(error instanceof Error) {
            return NextResponse.json(
                { 
                    error_code: 'update_user_error',
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
