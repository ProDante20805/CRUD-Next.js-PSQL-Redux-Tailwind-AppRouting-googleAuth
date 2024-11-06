"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from  "next/navigation";
import axios from '../../../lib/axios';
import Notification from "../components/Notification";
import LoginButton from "../components/LoginButton";
import loginValidation from "../../../validation/loginValidation";
import { useDispatch, useSelector } from "react-redux";
import { setMessage } from '../../../store/authSlice';
import { RootState } from '../../../store';

const SignIn: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState({ email: '', password: ''});

  const { message } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    setTimeout(() => {
      dispatch(setMessage(""));
    }, 2500);
  }, [message]);
 
  const handleSubmit = async () => {
    const checkInput = loginValidation(email, password);
    setError(checkInput);
    if(!checkInput.email && !checkInput.password) {
      try {
        const response = await axios.post("/api/auth/signin", 
          { email, password }
        );
  
        const data = await response.data;
        // Save token in localStorage or use context to manage session
        localStorage.setItem("token", data.token);
        dispatch(setMessage("Successfully login"));
        setTimeout(() => {
          router.push("/tasks");
        }, 2500);
      } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
          dispatch(setMessage(error.response.data.error || "An error occurred while signing up."));
        } else {
          // Non Axios errors
          dispatch(setMessage("Unexpected error: " + error.message));
          console.error("Unexpected error:", error);
        }
      }
    }
  };

  const goRegister = () => {
    router.push("/auth/register")
  }

  const checkEmail = (email: string) => {
    if(!email) {
      setError((prev) => ({ ...prev, email: 'Email is required.' }));
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError((prev) => ({ ...prev, email: 'Email is not valid.' }));
    } else {
      setError((prev) => ({ ...prev, email: '' }));
    }
  }

  const inputEmail = (e: any) => {
    const value = e.target.value;
    setEmail(value);
    checkEmail(value);
  }

  const checkPassword = (password: string) => {
    if(!password) {
      setError((prev) => ({ ...prev, password: 'Password is required.' }));
    } else if(password.length <= 6) {
      setError((prev) => ({ ...prev, password: 'Password must be longer than 6 characters.' }));
    } else {
      setError((prev) => ({ ...prev, password: '' }));
    }
  }

  const inputPassword = (e: any) => {
    const value = e.target.value;
    setPassword(value);
    checkPassword(value);
  }

  const handleKeyDown = (e: any, field: string) => {
    if(e.key === 'Enter') {
      if(field === 'email') {
        passwordInputRef.current?.focus();
      } else {
        handleSubmit();
      }
    }
  }

  return (
    <div className="mt-20">
      <Notification /> 

      <div className="grid gap-2 justify-center">
        <input
          type="email"
          placeholder="Enter Your Email"
          className="input input-bordered w-full max-w-xs mr-5"
          onChange={(e) => inputEmail(e)}
          value={email}
          onKeyDown={(e) => handleKeyDown(e, "email")}
        />
        { error.email ? (<span className="text-red-500 text-sm">{error.email}</span>) : '' }
       
        <input
          type="password"
          placeholder="Enter Your Password"
          className="input input-bordered w-full max-w-xs mr-5"
          onChange={(e) => inputPassword(e)}
          value={password}
          ref={passwordInputRef}
          onKeyDown={(e) => handleKeyDown(e, "password")}
        />
        { error.password ? (<span className="text-red-500 text-sm">{error.password}</span>) : '' }
      </div>

      <div className="grid gap-2 justify-center mt-2">
        <button 
          className="btn btn-outline btn-info" 
          onClick={(e) => handleSubmit()}
        >
          Log in
        </button>

        <LoginButton />
        <div className="flex">
          <span>Don't have an account? </span>
          <span className="ml-2 cursor-pointer"
            onClick={goRegister}
          >
            SignUp
          </span>
        </div>
        
      </div>
    </div>
  );
}

export default SignIn;
