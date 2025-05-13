"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { hashPassword } from "@/lib/hash";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [full_name, setFullname] = useState("");
  
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignup = async () => {
    const res = await fetch("/api/signup", {
      method: "POST",
      body: JSON.stringify({ username, full_name, email, password }),
    });

    if (res.ok) {
      router.push("/login");
    } else {
      alert("Signup failed");
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
      <input value={full_name} onChange={e => setFullname(e.target.value)} placeholder="full name" />
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleSignup}>Register</button>
    </div>
  );
}
