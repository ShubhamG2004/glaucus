import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function Layout({ children }) {
  const [userEmail, setUserEmail] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserEmail(user ? user.email : null);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setMobileMenuOpen(false);
    if (router.pathname !== "/") router.push("/");
  };

  const NavLink = ({ href, children, icon }) => {
    const isActive = router.pathname === href;
    const baseClasses = "inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors";
    const activeClasses = "text-blue-600 bg-blue-50 font-semibold";
    const inactiveClasses = "text-gray-700 hover:text-blue-500 hover:bg-gray-100";
    
    return (
      <Link 
        href={href} 
        className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
        onClick={() => setMobileMenuOpen(false)}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="bg-white shadow-sm">
        <div className="px-4 sm:px-6">
          <div className="flex justify-between h-16 items-center">
            {/* Left side - Logo and main nav (desktop) */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <span className="text-xl font-bold text-blue-600">🐟 Glaucus</span>
              </Link>
              <nav className="hidden md:ml-6 md:flex md:space-x-4">
                <NavLink href="/" icon="🏠">Home</NavLink>
                <NavLink href="/history" icon="📜">History</NavLink>
                <NavLink href="/FishAnalytics" icon="📊">Fish Analysis</NavLink>
              </nav>
            </div>

            {/* Right side - Auth and user info */}
            <div className="hidden md:flex items-center space-x-4">
              {userEmail ? (
                <div className="flex items-center space-x-4">
                  <div className="relative group">
                    <button className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-blue-600">
                      <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        {userEmail.charAt(0).toUpperCase()}
                      </span>
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        <div className="font-medium truncate">{userEmail}</div>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <NavLink href="/login" icon="🔐">Login</NavLink>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="pt-2 pb-3 space-y-1 px-4">
              <NavLink href="/" icon="🏠">Home</NavLink>
              <NavLink href="/history" icon="📜">History</NavLink>
              <NavLink href="/FishAnalytics" icon="📊">Fish Analysis</NavLink>
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200 px-4">
              {userEmail ? (
                <>
                  <div className="flex items-center px-4">
                    <div className="flex-shrink-0">
                      <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        {userEmail.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-700 truncate">{userEmail}</div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    >
                      Sign out
                    </button>
                  </div>
                </>
              ) : (
                <NavLink href="/login" icon="🔐">Login</NavLink>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content - Removed max-width and horizontal padding */}
      <main className="flex-1 mx-5">
        {children}
      </main>
    </div>
  );
}