import { useState } from "react";
import { useRouter } from "next/router";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("register"); // 'register', 'sent'

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await sendEmailVerification(user);
        setStatus("sent");
    } catch (err) {
        if (err.code === "auth/email-already-in-use") {
        alert("⚠️ This email is already registered. Please log in instead.");
        } else {
        alert(err.message);
        }
    }
    };


  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <div className="bg-white p-8 rounded shadow w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Register to Glaucus 🐟</h1>

        {status === "register" ? (
          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="email"
              className="w-full p-2 border rounded"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              className="w-full p-2 border rounded"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded"
            >
              Register
            </button>
          </form>
        ) : (
          <div>
            <p className="text-gray-700 mb-4">
              ✅ Verification email sent to <strong>{email}</strong>. Please check your inbox and click the verification link.
            </p>
            <button
              onClick={() => router.push("/login")}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
