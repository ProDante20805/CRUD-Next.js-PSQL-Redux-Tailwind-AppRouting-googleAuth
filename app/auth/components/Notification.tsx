"use client";
import { useState, Dispatch, SetStateAction, useEffect, FC } from 'react';

interface Props {
    message: string;
    setMessage: Dispatch<SetStateAction<string>>;
}

const Notification: FC<Props> = ({message, setMessage}) => {
  
  useEffect(() => {
    const timer = setTimeout(() => {
        setMessage("")
    }, 2000);
    return () => clearTimeout(timer);
  }, [setMessage]);

  return (
    <div className="toast toast-top toast-center">
        <div className="alert alert-success">
            <span>{message}</span>
        </div>
    </div>
  );
}

export default Notification;