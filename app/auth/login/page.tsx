"use client";

import { useState, useEffect } from "react";
import { useRouter } from  "next/navigation";
import axios from '../../../lib/axios';
import Notification from "../components/Notification";
import LoginButton from "../components/LoginButton";
import loginValidation from "../../../validation/loginValidation";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState({ email: '', password: ''});

  const router = useRouter();
 
  useEffect(() => {
    const refreshToken = localStorage.getItem('refreshToken'); // or use props.token if passed
    if(refreshToken) {
      router.push('/tasks')
    }
  }, []); // Depend on router to ensure effect runs again if router updates


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
         localStorage.setItem("refreshToken", data.refreshToken);
        setMessage("Successfully login")
        router.push("/tasks");
      } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
          setMessage(error.response.data.error || "An error occurred while signing up.");
        } else {
          // Non Axios errors
          setMessage("Unexpected error: " + error.message);
          console.error("Unexpected error:", error);
        }
      }
    }
  };

  const goRegister = () => {
    router.push("/auth/register")
  }

  return (
    <div className="mt-20">
      {
        message ? 
          <Notification message={message} setMessage={setMessage} /> 
        : 
        ""
      }
      <div className="grid gap-2 justify-center">
        { error.email ? (<span className="text-red-500 text-sm">{error.email}</span>) : '' }
        <input
          type="email"
          placeholder="Enter Your Email"
          className="input input-bordered w-full max-w-xs mr-5"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        { error.password ? (<span className="text-red-500 text-sm">{error.password}</span>) : '' }
        <input
          type="password"
          placeholder="Enter Your Password"
          className="input input-bordered w-full max-w-xs mr-5"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
      </div>

      <div className="grid gap-2 justify-center mt-2">
        <button 
          className="btn btn-outline btn-info" 
          onClick={(e) => handleSubmit(e)}
        >
          Log in
        </button>

        <LoginButton />
        <div className="flex">
          <span>Don't have an account? </span>
          <span className="ml-2"
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
