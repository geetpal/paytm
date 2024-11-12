"use client"
import Image from "next/image";
import { Button } from "@repo/ui/button";
import styles from "./page.module.css";
import { Appbar } from "@repo/ui/appbar";


import { signIn, signOut, useSession } from "next-auth/react";



export default function Home() {
  const session = useSession();
  return (
    <div>
    <Appbar onSignin={signIn} onSignout={signOut} user={session.data?.user}/>
      <div className="text-2xl">
        Hi there
      </div>
    </div>
  ); 
}