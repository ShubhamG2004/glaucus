import { useState } from "react";
import { useRouter } from "next/router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import emailjs from "@emailjs/browser";

export default function Register() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [enteredCode, setEnteredCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);

      // Generate a 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(code);

      // Send the code via EmailJS
      await emailjs.send(
        "service_xk34nsa", // your EmailJS service ID
        "template_jv4jqws", // your EmailJS template ID
        {
          title: "Glaucus Verification Code",
          name: email,
          time: new Date().toLocaleTimeString(),
          message: `Your verification code is ${code}`,
          email: email,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      );

      setStep(2);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleVerifyCode = (e) => {
    e.preventDefault();
    if (enteredCode === generatedCode) {
      alert("✅ Email Verified!");
      router.push("/");
    } else {
      alert("❌ Incorrect code. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <div className="bg-white p-8 rounded shadow w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Register to Glaucus 🐟</h1>

        {step === 1 ? (
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
            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
              Register
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <p className="text-gray-600 mb-2">A verification code has been sent to <strong>{email}</strong>.</p>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Enter verification code"
              onChange={(e) => setEnteredCode(e.target.value)}
              required
            />
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
              Verify Code
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
