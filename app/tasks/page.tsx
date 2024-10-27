"use client";

import { useState, ChangeEvent, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, addTask, editTask, deleteTask } from '../../store/tasksSlice';
import type { RootState, AppDispatch } from '../../store';
import { useRouter } from 'next/navigation';
import withAuth from "../../hoc/withAuth";
import { signIn, signOut, useSession } from 'next-auth/react';

const TaskComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) => state.tasks.items);
  const loading = useSelector((state: RootState) => state.tasks.loading);
  const errorMessage = useSelector((state: RootState) => state.tasks.error);
  const router = useRouter();
  const { data: session } = useSession();

  const [value, setValue] = useState<string>("");
  const [isEdit, setIsEdit] = useState<boolean>(true);
  const [id, setId] = useState<number>(0);

  // Fetch tasks on component mount
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value);

  const handleAddTask = async () => {
    if (value.trim()) {
      dispatch(addTask(value));
      setValue("");
    }
  };

  const logout = async () => {
    if(session?.user?.name) {
      signOut()
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      router.push("/auth/login");
    }
  }

  const handleEditTask = async () => {
    if (value.trim()) {
      dispatch(editTask({ id, title: value }));
      setValue("");
      setIsEdit(true);
    }
  };

  const handleEdit = (taskId: number, taskName: string) => {
    setIsEdit(false);
    setId(taskId);
    setValue(taskName);
  };

  const handleDeleteTask = (taskId: number) => {
    dispatch(deleteTask(taskId));
  };

  const cancelEdit = () => {
    setIsEdit(true);
    setValue("");
  };

  return (
    <div className="mt-20">
      <div className="flex justify-center">
        <button className="btn btn-outline btn-error mr-2" onClick={logout}>Logout</button>
        <input
          type="text"
          placeholder={isEdit ? "Add a new title" : "Edit the title"}
          className="input input-bordered w-full max-w-xs mr-5"
          onChange={handleInputChange}
          value={value}
        />
        <button className="btn btn-outline btn-info" onClick={isEdit ? handleAddTask : handleEditTask}>
          {isEdit ? "Add" : "Save"}
        </button>
        {!isEdit && (
          <button className="ml-2 btn btn-outline btn-warning btn-sm" onClick={cancelEdit}>
            Cancel
          </button>
        )}
      </div>
      <div className="m-auto max-w-lg">
        <table className="table">
          <thead>
            <tr>
              <th className="w-10">No</th>
              <th>Name</th>
              <th className="w-40">Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={task.id}>
                <td>{index + 1}</td>
                <td>{task.title}</td>
                <td className="flex">
                  <button className="btn btn-outline btn-success btn-xs" onClick={() => handleEdit(task.id, task.title)}>
                    Edit
                  </button>
                  <button className="ml-2 btn btn-outline btn-error btn-xs" onClick={() => handleDeleteTask(task.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {loading && <div>Loading...</div>}
      {errorMessage && <div>Error: {errorMessage}</div>}
    </div>
  );
}

export default withAuth(TaskComponent);
