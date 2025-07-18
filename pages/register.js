import { useState } from "react";
import { useRouter } from "next/router";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../lib/firebase";
import Head from "next/head";
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("register"); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);
      setStatus("sent");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please log in instead.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters");
      } else {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Register | Glaucus AI</title>
        <meta name="description" content="Create your Glaucus account for fish identification" />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50 p-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-md border border-gray-100">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-teal-600 to-blue-600 p-6 text-center">
            <div className="flex justify-center mb-2">
              <div className="bg-white/20 p-3 rounded-full">
                <span className="text-2xl">🐟</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white">Create Your Account</h1>
            <p className="text-blue-100 mt-1">Join Glaucus AI today</p>
          </div>

          <div className="p-6 sm:p-8">
            {status === "register" ? (
              <>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      id="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      id="password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                  </div>

                  {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full px-4 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg font-medium hover:from-teal-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating account...
                      </span>
                    ) : "Register"}
                  </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                  Already have an account?{" "}
                  <Link 
                    href="/login" 
                    className="font-medium text-blue-600 hover:text-blue-500 hover:underline transition-colors"
                  >
                    Log in here
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-lg font-medium text-gray-900 mb-2">Verification Email Sent!</h2>
                <p className="text-gray-600 mb-6">
                  We&apos;ve sent a verification link to <span className="font-semibold text-gray-800">{email}</span>. 
                  Please check your inbox and click the link to verify your account.
                </p>
                <button
                  onClick={() => router.push("/login")}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Continue to Login
                </button>
                <p className="mt-4 text-sm text-gray-500">
                  Didn&apos;t receive the email?{" "}
                  <button 
                    onClick={handleRegister}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Resend verification
                  </button>
                </p>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200 text-center text-xs text-gray-400">
              By registering, you agree to our Terms and Privacy Policy.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}