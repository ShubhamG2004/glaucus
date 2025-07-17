// pages/_app.js
import "../styles/globals.css";
import dynamic from "next/dynamic";

const Layout = dynamic(() => import("../components/Layout"), {
  ssr: false, 
});

export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
