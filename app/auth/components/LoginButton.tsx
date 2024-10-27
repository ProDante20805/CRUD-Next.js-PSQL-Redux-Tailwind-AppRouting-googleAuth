// components/LoginButton.tsx
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const LoginButton = () => {
  const { data: session } = useSession();
  const router = useRouter()

  if (session) {
    // return (
    //   <div>
    //     <p>Welcome, {session.user?.name}</p>
    //     <button onClick={() => signOut()}>Sign out</button>
    //   </div>
    // );
    router.push('/tasks')
  }
  return (
    <button 
      className="btn btn-outline btn-success" 
      onClick={() => signIn('google')}
    >
      Log in with Google
    </button>
  )
  // return <button onClick={() => signIn('google')}>Sign in with Google</button>;
};

export default LoginButton;
