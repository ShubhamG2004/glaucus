import { auth, provider } from "../lib/firebase";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      router.push("/");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <div className="bg-white p-8 rounded shadow w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Login to Glaucus 🐠</h1>
        
        <button onClick={handleGoogleLogin} className="bg-red-500 text-white px-4 py-2 rounded mb-4 w-full">
          Sign in with Google
        </button>

        <hr className="my-4" />
        <form onSubmit={handleEmailLogin} className="space-y-3">
          <input
            className="w-full p-2 border rounded"
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full p-2 border rounded"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
            Sign in with Email
          </button>
        </form>
      </div>
    </div>
  );
}
