import { auth } from "../lib/firebase";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/router";
import UploadForm from "../components/UploadForm";
import GlaucusResponse from "../components/GlaucusResponse";

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
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 p-8">
      <div className="max-w-xl mx-auto text-center">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold text-blue-700">Glaucus 🐠</h1>
          <button
            onClick={() => signOut(auth)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <p className="text-gray-700 mb-6">
          Hello <strong>{user.displayName || user.email}</strong>, upload a fish image and let Glaucus tell you all about it!
        </p>

        <UploadForm onResult={setResult} />
        <GlaucusResponse message={result} />
      </div>
    </div>
  );
}
