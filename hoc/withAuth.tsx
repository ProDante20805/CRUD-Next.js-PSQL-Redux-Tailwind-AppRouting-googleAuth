// hoc/withAuth.tsx
import React, { ComponentType, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
    const { data: session } = useSession();

    useEffect(() => {
      const checkTokens = async () => {
        const token = localStorage.getItem('token'); // or use props.token if passed
        if(!session?.user?.name) {
          if (!token) {
              router.push('/auth/login'); // Redirect to login if token is invalid
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
