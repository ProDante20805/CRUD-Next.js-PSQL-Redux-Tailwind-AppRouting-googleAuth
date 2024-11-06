"use client";
import { useState, Dispatch, SetStateAction, useEffect, FC } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { setMessage } from '../../../store/authSlice';
import { RootState } from '../../../store';


const Notification: React.FC = () => {
  const { message } = useSelector((state: RootState) => state.auth);

  if(!message) {
    return null;
  }

  return (
    <div className="toast toast-top toast-center">
        <div className="alert alert-success">
            <span>{message}</span>
        </div>
    </div>
  );
}

export default Notification;