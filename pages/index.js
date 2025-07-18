import { auth } from "../lib/firebase";
import { useEffect, useState, useRef } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/router";
import UploadForm from "../components/UploadForm";
import GlaucusResponse from "../components/GlaucusResponse";
import Head from "next/head";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { analyzeFishImage } from "../lib/geminiVision";

export default function Home() {
  const [user, setUser] = useState(null);
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [userQuestion, setUserQuestion] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const router = useRouter();
  const resultRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleImageUpload = (response, imageUrl, base64Image) => {
    setResult(response);
    setImageUrl(imageUrl);
    setImageBase64(base64Image);

    setChatMessages([
      {
        sender: "ai",
        content: response,
        type: "initial-response",
      },
    ]);
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();

    if (!userQuestion.trim()) return;

    if (!imageBase64) {
      alert("Please upload an image before asking a question.");
      return;
    }

    const newUserMessage = {
      sender: "user",
      content: userQuestion,
      type: "question",
    };

    setChatMessages((prev) => [...prev, newUserMessage]);
    setUserQuestion("");
    setIsLoading(true);

    try {
      const response = await analyzeFishImage(imageBase64, userQuestion);

      const newAiMessage = {
        sender: "ai",
        content: response,
        type: "follow-up",
      };

      setChatMessages((prev) => [...prev, newAiMessage]);
    } catch (error) {
      console.error("Error:", error);
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          content: "Sorry, something went wrong. Please try again.",
          type: "error",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPNG = async () => {
    if (!resultRef.current) return;
    try {
      setIsLoading(true);
      const canvas = await html2canvas(resultRef.current);
      const link = document.createElement("a");
      link.download = "glaucus-analysis.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Error generating PNG:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!resultRef.current) return;
    try {
      setIsLoading(true);
      const canvas = await html2canvas(resultRef.current);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("glaucus-analysis.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <Head>
        <title>Glaucus | AI-Powered Fish Identification</title>
        <meta name="description" content="AI-powered fish identification and analysis tool" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <header className="flex justify-between items-center bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm">
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              <h1 className="text-2xl font-bold text-gray-800">Glaucus AI</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 hidden sm:inline">Welcome, {user.email}</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Sign Out</span>
              </button>
            </div>
          </header>

          {/* Upload Section */}
          <section className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Fish Image</h2>
            <UploadForm
              onResult={handleImageUpload}
              onLoadingChange={setIsLoading}
            />
          </section>

          {/* Results Section */}
          {isLoading && !chatMessages.length ? (
            <div className="flex flex-col items-center justify-center p-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600">Analyzing your fish image...</p>
            </div>
          ) : (
            chatMessages.length > 0 && (
              <section className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm" ref={resultRef}>
                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-3/4 rounded-lg p-4 ${msg.sender === "user"
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-gray-100 text-gray-800 rounded-bl-none"
                        }`}
                      >
                        {msg.sender === "ai" && msg.type === "initial-response" ? (
                          <GlaucusResponse message={msg.content} />
                        ) : (
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                {isLoading && (
                  <div className="flex items-center justify-start mb-4">
                    <div className="bg-gray-100 rounded-lg p-4 rounded-bl-none">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}

                <form
                  onSubmit={handleQuestionSubmit}
                  className="flex flex-col sm:flex-row gap-2 mt-6"
                >
                  <input
                    type="text"
                    value={userQuestion}
                    onChange={(e) => setUserQuestion(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Ask a question about this fish..."
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
                    disabled={isLoading || !userQuestion.trim()}
                  >
                    {isLoading ? (
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                      </svg>
                    )}
                    Ask Question
                  </button>
                </form>

                <div className="flex justify-end mt-6 gap-3">
                  <button
                    onClick={downloadPNG}
                    className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
                    disabled={isLoading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>PNG</span>
                  </button>
                  <button
                    onClick={downloadPDF}
                    className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
                    disabled={isLoading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span>PDF</span>
                  </button>
                </div>
              </section>
            )
          )}

          {/* Footer */}
          <footer className="text-center text-sm text-gray-500 mt-8 pb-4">
            <p>Glaucus AI - Advanced fish identification powered by AI</p>
          </footer>
        </div>
      </div>
    </>
  );
}