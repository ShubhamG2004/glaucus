import { auth } from "../lib/firebase";
import { useEffect, useState, useRef } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/router";
import UploadForm from "../components/UploadForm";
import GlaucusResponse from "../components/GlaucusResponse";
import Head from "next/head";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export default function Home() {
  const [user, setUser] = useState(null);
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const resultRef = useRef(null);

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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const downloadPNG = async () => {
    if (!resultRef.current) return;
    
    try {
      const canvas = await html2canvas(resultRef.current);
      const link = document.createElement('a');
      link.download = 'glaucus-analysis.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error("Error generating PNG:", error);
    }
  };

  const downloadPDF = async () => {
    if (!resultRef.current) return;
    
    try {
      const canvas = await html2canvas(resultRef.current);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('glaucus-analysis.pdf');
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  if (!user) return null;

  return (
    <>
      <Head>
        <title>Glaucus | AI-Powered Fish Identification</title>
        <meta name="description" content="Advanced AI technology to identify fish species from your images" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100 transition-all hover:shadow-lg">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-3 rounded-full">
                  <span className="text-2xl">🐠</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Glaucus AI</h1>
                  <p className="text-gray-600">Advanced Fish Identification</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="hidden md:block text-right">
                  <p className="text-sm text-gray-500">Welcome back</p>
                  <p className="font-medium text-gray-800 truncate max-w-xs">
                    {user.displayName || user.email}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                  </svg>
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Upload Card */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Upload Fish Image</h2>
                <p className="text-gray-600 mt-1">Get instant species identification with our AI technology</p>
              </div>
              <UploadForm 
                onResult={setResult} 
                onLoadingChange={setIsLoading}
              />
            </div>

            {/* Results Section */}
            {isLoading ? (
              <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100 flex flex-col items-center justify-center">
                <div className="animate-pulse flex space-x-4">
                  <div className="rounded-full bg-blue-100 h-12 w-12"></div>
                </div>
                <p className="mt-4 text-gray-600">Analyzing your image...</p>
              </div>
            ) : result ? (
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                <div className="bg-blue-600 px-6 py-3 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-white">Identification Results</h3>
                  <div className="flex space-x-2">
                    <button 
                      onClick={downloadPNG}
                      className="flex items-center space-x-1 bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>PNG</span>
                    </button>
                    <button 
                      onClick={downloadPDF}
                      className="flex items-center space-x-1 bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span>PDF</span>
                    </button>
                  </div>
                </div>
                <div className="p-6" ref={resultRef}>
                  <GlaucusResponse message={result} />
                </div>
              </div>
            ) : (
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 text-center">
                <p className="text-blue-800">Upload a fish image to get started with identification</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-12 text-center text-sm text-gray-500">
            <p>Glaucus AI &copy; {new Date().getFullYear()} - Advanced Marine Life Identification</p>
          </div>
        </div>
      </div>
    </>
  );
}