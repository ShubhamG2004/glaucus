import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserEmail(user ? user.email : null);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    if (router.pathname !== "/") router.push("/");
  };

  // Navigation link component for consistent styling
  const NavLink = ({ href, children, icon }) => {
    const isActive = router.pathname === href;
    const baseClasses = "block py-2 px-3 rounded-md transition-colors";
    const activeClasses = "text-blue-600 font-semibold bg-blue-50";
    const inactiveClasses = "text-gray-700 hover:text-blue-500 hover:bg-gray-50";
    
    return (
      <Link href={href} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed z-30 inset-y-0 left-0 w-64 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition duration-200 ease-in-out md:relative md:translate-x-0 bg-white shadow-md`}
        aria-hidden={!sidebarOpen}
      >
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-bold text-blue-600">🐟 Glaucus</h2>
          <nav className="space-y-1">
            <NavLink href="/" icon="🏠">Home</NavLink>
            <NavLink href="/history" icon="📜">History</NavLink>
            {userEmail ? (
              <button
                onClick={handleLogout}
                className="w-full text-left py-2 px-3 rounded-md text-red-600 hover:bg-red-50 transition-colors"
                type="button"
              >
                <span className="mr-2">🚪</span>Logout
              </button>
            ) : (
              <NavLink href="/login" icon="🔐">Login</NavLink>
            )}
          </nav>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-md px-4 py-3 flex items-center justify-between">
          <button
            className="md:hidden text-gray-600 p-2 rounded-md hover:bg-gray-100"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            type="button"
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
          {userEmail ? (
            <span className="text-sm text-gray-600">
              Signed in as <strong className="font-medium">{userEmail}</strong>
            </span>
          ) : (
            <Link href="/login" className="text-blue-600 hover:underline">
              <span className="mr-1">🔐</span> Sign In
            </Link>
          )}
        </header>

        <main className="flex-1 p-4 overflow-auto">{children}</main>
      </div>
    </div>
  );
}