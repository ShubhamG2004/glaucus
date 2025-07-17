import { auth } from "../lib/firebase";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/router";
import UploadForm from "../components/UploadForm";
import GlaucusResponse from "../components/GlaucusResponse";
import Head from "next/head";

export default function Home() {
  const [user, setUser] = useState(null);
  const [result, setResult] = useState("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        if (router.pathname !== "/login") {
          router.push("/login");
        }
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (!user) return null;

  return (
    <>
      <Head>
        <title>Glaucus | Fish Identifier</title>
        <meta name="description" content="Upload a fish image and let Glaucus identify it!" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-teal-500 to-indigo-600 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          {/* Header Card (Glassmorphism Effect) */}
          <div className="bg-white/20 backdrop-blur-lg rounded-xl shadow-xl p-6 mb-6 border border-white/10 transition-all hover:shadow-2xl">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <h1 className="text-4xl font-bold text-white drop-shadow-md">Glaucus</h1>
                <span className="text-3xl">🐠</span>
              </div>
              <button
                onClick={() => signOut(auth)}
                className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-lg shadow hover:from-red-600 hover:to-pink-700 transition-all transform hover:scale-105"
              >
                Logout
              </button>
            </div>

            <p className="text-white/90 mt-4 text-lg">
              Hello <strong className="text-white">{user.displayName || user.email}</strong>, upload a fish image and let Glaucus identify it!
            </p>
          </div>

          {/* Upload Form & Results Section */}
          <div className="space-y-6">
            <div className="bg-white/20 backdrop-blur-lg rounded-xl shadow-xl p-6 border border-white/10">
              <UploadForm onResult={setResult} />
            </div>

            {result && (
              <div className="animate-fadeIn bg-white/20 backdrop-blur-lg rounded-xl shadow-xl p-6 border border-white/10">
                <GlaucusResponse message={result} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}