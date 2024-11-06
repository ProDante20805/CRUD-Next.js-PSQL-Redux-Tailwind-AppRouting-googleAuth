"use client";

import { useState, ChangeEvent, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, addUser, editUser, deleteUser } from '../../store/usersSlice';
import type { RootState, AppDispatch } from '../../store';
import { useRouter } from 'next/navigation';
import withAuth from "../../hoc/withAuth";

const UserComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector((state: RootState) => state.users.items);
  const loading = useSelector((state: RootState) => state.users.loading);
  const errorMessage = useSelector((state: RootState) => state.users.error);
  const router = useRouter();

  const [value, setValue] = useState<string>("");
  const [isEdit, setIsEdit] = useState<boolean>(true);
  const [id, setId] = useState<number>(0);

  // Fetch users on component mount
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value);

  const handleAddUser = async () => {
    if (value.trim()) {
      dispatch(addUser(value));
      setValue("");
    }
  };

  const logout = async () => {
    localStorage.removeItem('token');
    router.push("/auth/login");
  }

  const handleEditUser = async () => {
    if (value.trim()) {
      dispatch(editUser({ id, title: value }));
      setValue("");
      setIsEdit(true);
    }
  };

  const handleEdit = (userId: number, userName: string) => {
    setIsEdit(false);
    setId(userId);
    setValue(userName);
  };

  const handleDeleteUser = (userId: number) => {
    dispatch(deleteUser(userId));
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
        <button className="btn btn-outline btn-info" onClick={isEdit ? handleAddUser : handleEditUser}>
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
            {users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.email}</td>
                <td className="flex">
                  <button className="btn btn-outline btn-success btn-xs" onClick={() => handleEdit(user.id, user.title)}>
                    Edit
                  </button>
                  <button className="ml-2 btn btn-outline btn-error btn-xs" onClick={() => handleDeleteUser(user.id)}>
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

export default withAuth(UserComponent);
