import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function Layout({ children }) {
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

  const NavLink = ({ href, children, icon }) => {
    const isActive = router.pathname === href;
    const baseClasses = "inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors";
    const activeClasses = "text-blue-600 bg-blue-50 font-semibold";
    const inactiveClasses = "text-gray-700 hover:text-blue-500 hover:bg-gray-100";
    
    return (
      <Link href={href} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
        {icon && <span className="mr-1">{icon}</span>}
        {children}
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Top Navigation Bar */}
      <header className="bg-white shadow px-6 py-4 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-blue-600">🐟 Glaucus</h2>
          <nav className="flex gap-3">
            <NavLink href="/" icon="🏠">Home</NavLink>
            <NavLink href="/history" icon="📜">History</NavLink>
            <NavLink href="/FishAnalytics" icon="🐟">Fish Analysis</NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {userEmail ? (
            <>
              <span className="text-sm text-gray-600">
                Signed in as <strong>{userEmail}</strong>
              </span>
              <button
                onClick={handleLogout}
                className="text-red-600 px-3 py-1 rounded-md hover:bg-red-50 text-sm transition-colors"
              >
                <span className="mr-1">🚪</span> Logout
              </button>
            </>
          ) : (
            <NavLink href="/login" icon="🔐">Login</NavLink>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
