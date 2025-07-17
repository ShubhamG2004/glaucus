import "../styles/globals.css";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

const Layout = dynamic(() => import("../components/Layout"), {
  ssr: false,
});

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // Define routes where Layout should NOT be applied
  const noLayoutRoutes = ["/login", "/register"];

  const isLayoutExcluded = noLayoutRoutes.includes(router.pathname);

  return isLayoutExcluded ? (
    <Component {...pageProps} />
  ) : (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
