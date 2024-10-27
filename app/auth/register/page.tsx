"use client";

import { useState } from "react";
import { useRouter } from  "next/navigation";
import axios from '../../../lib/axios';
import Notification from "../components/Notification";


const SignUp: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/signup", { email, password });
      const data = await response.data;
      setMessage("Successfully registered!")
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
          setMessage(error.response.data.error || "An error occurred while signing up.");
        } else {
          // Non Axios errors
          setMessage("Unexpected error: " + error.message);
          console.error("Unexpected error:", error);
        }
    }
  };

  const goLogin = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    router.push("/auth/login")
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
        <input
          type="email"
          placeholder="Enter Your Email"
          className="input input-bordered w-full max-w-xs mr-5"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <input
          type="password"
          placeholder="Enter Your Password"
          className="input input-bordered w-full max-w-xs mr-5"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
      </div>

      <div className="grid gap-2 justify-center max-w-xs m-auto mt-2">
        <button 
          className="btn btn-outline btn-info" 
          onClick={(e) => handleSubmit(e)}
        >
          Submit
        </button>

        <div>
          <span>Already have an account?</span>
          <span className="ml-2"
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
