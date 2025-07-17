import { auth, provider } from "../lib/firebase";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await signInWithPopup(auth, provider);
      router.push("/");
    } catch (err) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (err) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login | Glaucus AI</title>
        <meta name="description" content="Login to access fish identification features" />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden w-full max-w-md border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center">
            <div className="flex justify-center mb-2">
              <div className="bg-white/20 p-3 rounded-full">
                <span className="text-2xl">🐠</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white">Welcome to Glaucus</h1>
            <p className="text-blue-100 mt-1">AI-Powered Fish Identification</p>
          </div>

          <div className="p-6 sm:p-8">
            {/* Google Login */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="flex items-center justify-center space-x-2 w-full px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors mb-4"
            >
              {/* Google SVG Icon */}
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <g>
                  <path fill="#4285F4" d="M12 11.5v2.9h7.1c-.3 1.7-2.1 5-7.1 5-4.2 0-7.6-3.5-7.6-7.8s3.4-7.8 7.6-7.8c2.4 0 4 1 4.9 1.8l3.3-3.2C18.2 2.7 15.4 1.5 12 1.5 5.7 1.5.5 6.7.5 13S5.7 24.5 12 24.5c6.1 0 11.5-4.7 11.5-11.5 0-.8-.1-1.6-.2-2.3H12z" />
                  <path fill="#34A853" d="M12 24.5c3.1 0 5.7-1 7.6-2.7l-3.7-3c-1 .7-2.3 1.1-3.9 1.1-3 0-5.5-2-6.4-4.7H1.5v3c2.1 4.1 6.5 6.3 10.5 6.3z" />
                  <path fill="#FBBC05" d="M5.6 14.9c-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9v-3H1.5c-.6 1.2-1 2.6-1 4.1s.4 2.9 1 4.1l4.1-3.4z" />
                  <path fill="#EA4335" d="M12 7.1c1.7 0 3.2.6 4.4 1.7l3.3-3.2C18.2 2.7 15.4 1.5 12 1.5c-4.2 0-7.6 3.5-7.6 7.8 0 1.4.4 2.8 1 4.1l4.1-3.4c.9-2.7 3.4-4.7 6.5-4.7z" />
                </g>
              </svg>
              <span>{isLoading ? "Signing in..." : "Continue with Google"}</span>
            </button>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="mx-4 text-gray-400 text-sm">OR</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* Email Login */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
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
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  id="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </span>
                ) : "Sign in with Email"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>{"Don't have an account?"}</p>
              <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500 hover:underline transition-colors">
                Create one
              </Link>
            </div>

            <div className="mt-4 text-center text-xs text-gray-400">
              By continuing, you agree to our Terms and Privacy Policy.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
