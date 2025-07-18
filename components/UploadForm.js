import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toBase64 } from "../lib/utils";
import { analyzeFishImage } from "../lib/geminiVision";
import { db, auth } from "../lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export default function UploadForm({ onResult, onLoadingChange }) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    onLoadingChange(true); // notify parent

    try {
      const base64 = await toBase64(image);

      const result = await analyzeFishImage(base64);

      // Pass all 3 required values to the parent
      onResult(result, preview, base64);

      // Save to Firestore (optional)
      await addDoc(collection(db, "detections"), {
        imageName: image.name,
        imageData: base64,
        result,
        userEmail: auth.currentUser?.email || "anonymous",
        timestamp: Timestamp.now(),
      });

      console.log("✅ Stored in Firestore");
    } catch (error) {
      console.error("❌ Failed to analyze or store:", error);
    } finally {
      setLoading(false);
      onLoadingChange(false); // notify parent
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div
        {...getRootProps()}
        className="border-2 border-dashed p-6 w-full text-center cursor-pointer rounded-lg bg-blue-50 hover:bg-blue-100"
      >
        <input {...getInputProps()} />
        <p>📷 Drag & drop or click to upload a fish image</p>
      </div>

      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="w-64 h-auto rounded shadow"
        />
      )}

      <button
        onClick={handleAnalyze}
        disabled={!image || loading}
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? "Analyzing..." : "Ask Glaucus 🐠"}
      </button>
    </div>
  );
}
