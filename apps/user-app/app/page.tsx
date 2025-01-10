import { getServerSession } from "next-auth";
import { redirect } from 'next/navigation'
import { authOptions } from "./lib/auth";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    redirect('/dashboard')
  } else {
    redirect('/api/auth/signin')
  }
  
}
// "use client"
// import Image from "next/image";
// import { Button } from "@repo/ui/button";
// import styles from "./page.module.css";
// import { Appbar } from "@repo/ui/appbar";


// import { signIn, signOut, useSession } from "next-auth/react";



// export default function Home() {
//   const session = useSession();
//   return (
//     <>
//     {/* <Appbar onSignin={signIn} onSignout={signOut} user={session.data?.user}/> */}
    
//     </>
//   ); 
// }