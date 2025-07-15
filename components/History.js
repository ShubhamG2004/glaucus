import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";

export default function History() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [detections, setDetections] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          setUserEmail(user.email);
          await fetchDetections(user.email);
        } else {
          router.replace("/login");
        }
      } catch (err) {
        setError("Failed to load history");
        console.error(err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []); // Removed router dependency

  const fetchDetections = async (email) => {
    try {
      const q = query(
        collection(db, "detections"),
        where("userEmail", "==", email),
        orderBy("timestamp", "desc")
      );
      const snapshot = await getDocs(q);
      const userDetections = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setDetections(userDetections);
    } catch (err) {
      throw err; // Caught in parent try/catch
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded">
        ⚠️ {error} - <button onClick={() => window.location.reload()} className="underline">Try again</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 flex items-center">
        <span className="mr-2">📜</span> Detection History
      </h1>
      
      {detections.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No detections found</p>
          <button 
            onClick={() => router.push("/")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Upload your first image
          </button>
        </div>
      ) : (
        <ul className="space-y-4">
          {detections.map((det) => (
            <li key={det.id} className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="font-semibold">🖼️ Image</p>
                  <p className="truncate">{det.imageName || "Untitled"}</p>
                </div>
                <div>
                  <p className="font-semibold">💬 Result</p>
                  <p>{det.result || "No result"}</p>
                </div>
                <div>
                  <p className="font-semibold">📅 Date</p>
                  <p className="text-sm text-gray-500">
                    {det.timestamp?.toDate()?.toLocaleString() || "Unknown date"}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}