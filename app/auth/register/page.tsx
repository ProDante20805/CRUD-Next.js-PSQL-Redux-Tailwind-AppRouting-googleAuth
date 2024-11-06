"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from  "next/navigation";
import axios from '../../../lib/axios';
import Notification from "../components/Notification";
import registerValidation from "../../../validation/registerValidation";
import { useDispatch, useSelector } from "react-redux";
import { setMessage } from '../../../store/authSlice';
import { RootState } from '../../../store';

const SignUp: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");
  const [error, setError] = useState({ email: '', password: '', password2: ''});

  const { message } = useSelector((state: RootState) => state.auth);

  const password1InputRef = useRef<HTMLInputElement>(null);
  const password2InputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => {
      dispatch(setMessage(""));
    }, 2500);
  }, [message]);

  const handleSubmit = async () => {
    const checkInput = registerValidation(email, password, password2);
    setError(checkInput);
    if(!checkInput.email && !checkInput.password && !checkInput.password2) {
      try {
        const response = await axios.post("/api/auth/signup", { email, password });
        const data = await response.data;
        dispatch(setMessage("Successfully registered!"));
        setTimeout(() => {
          router.push("/auth/login");
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

  const checkEmail = (email: string) => {
    if(!email) {
      setError((prev) => ({ ...prev, email: 'Email is required.' }));
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError((prev) => ({ ...prev, email: 'Email is not valid.' }));
    } else {
      setError((prev) => ({ ...prev, email: '' }));
    }
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

  const checkPassword2 = (password2: string) => {
    if(!password2) {
      setError((prev) => ({ ...prev, password2: 'Confirm Password is required.' }));
    } else if(password !== password2) {
      setError((prev) => ({ ...prev, password2: 'Password must be matched.' }));
    } else {
      setError((prev) => ({ ...prev, password2: '' }));
    }
  }

  const handleInput = (e: any, field: string) => {
    const value = e.target.value;
    if(field === "email") {
      setEmail(value);
      checkEmail(value);
    } else if(field === "password1") {
      setPassword(value);
      checkPassword(value);
    } else if (field === "password2") {
      setPassword2(value);
      checkPassword2(value);
    }
  }

  const goLogin = () => {
    localStorage.removeItem('token');
    router.push("/auth/login")
  }

  const handleKeyDown = (e: any, field: string) => {
    if(e.key === "Enter") {
      if(field === "email") {
        password1InputRef.current?.focus();
      } else if(field === "password1") {
        password2InputRef.current?.focus();
      } else {
        handleSubmit()
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
          onChange={(e) => handleInput(e, "email")}
          value={email}
          onKeyDown={(e) => handleKeyDown(e, "email")}
        />
        { error.email ? (<span className="text-red-500 text-sm">{error.email}</span>) : '' }

        <input
          type="password"
          placeholder="Enter Your Password"
          className="input input-bordered w-full max-w-xs mr-5"
          onChange={(e) => handleInput(e, "password1")}
          value={password}
          ref={password1InputRef}
          onKeyDown={(e) => handleKeyDown(e, "password1")}
        />
        { error.password ? (<span className="text-red-500 text-sm">{error.password}</span>) : '' }

        <input
          type="password"
          placeholder="Confirm Password"
          className="input input-bordered w-full max-w-xs mr-5"
          onChange={(e) => handleInput(e, "password2")}
          value={password2}
          ref={password2InputRef}
          onKeyDown={(e) => handleKeyDown(e, "password2")}
        />
        { error.password2 ? (<span className="text-red-500 text-sm">{error.password2}</span>) : '' }
      </div>

      <div className="grid gap-2 justify-center max-w-xs m-auto mt-2">
        <button 
          className="btn btn-outline btn-info" 
          onClick={() => handleSubmit()}
        >
          Submit
        </button>

        <div>
          <span>Already have an account?</span>
          <span className="ml-2 cursor-pointer"
            onClick={goLogin}
          >
            Go to Login
          </span>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
