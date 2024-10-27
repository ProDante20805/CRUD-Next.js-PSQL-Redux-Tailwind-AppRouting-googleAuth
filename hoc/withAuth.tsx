// hoc/withAuth.tsx
import React, { ComponentType, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { verifyToken } from '../lib/auth';
import axios from 'axios';
import { signIn, signOut, useSession } from 'next-auth/react';

interface WithAuthProps {
  token: string | null; // Expecting token to be passed as a prop
}

function withAuth<T extends WithAuthProps>(
  WrappedComponent: ComponentType<T>
) {
  return (props: Omit<T, keyof WithAuthProps>) => {
    const router = useRouter();
    const [verified, setVerified] = useState(false);
    const [token, setToken] = useState<string>('');
    const [message, setMessage] = useState<string>("");
    const { data: session } = useSession();

    useEffect(() => {
      const checkTokens = async () => {
          const token = localStorage.getItem('token'); // or use props.token if passed
          const refreshToken = localStorage.getItem('refreshToken'); // or use props.token if passed
          if(!session?.user?.name) {
            if (!token || !verifyToken(token)) {
              if(!refreshToken || !verifyToken(refreshToken)) {
                  router.push('/auth/login'); // Redirect to login if token is invalid
              } else {
                try {
                  const response = await axios.post("/api/auth/getToken", 
                    { refreshToken }
                  );
          
                  const data = await response.data;
                  // Save token in localStorage
                  setToken(data.token);
                  localStorage.setItem("token", data.token);
                } catch (error: any) {
                  if (axios.isAxiosError(error) && error.response) {
                    setMessage(error.response.data.error || "An error occurred while signing up.");
                  } else {
                    // Non Axios errors
                    console.error("Unexpected error:", error);
                  }
                }
              }
            } else {
              setVerified(true);
            }
          } else {
            setVerified(true);
          }  
        };
      checkTokens();
    }, [router, token]);

    if(!verified) {
        return null;
    }
    return <WrappedComponent {...(props as T)} token={localStorage.getItem('token')} />;
  };
}

export default withAuth;
