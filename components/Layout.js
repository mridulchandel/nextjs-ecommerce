import Navbar from "./Navbar";
import Head from "next/head";

const Layout = ({ children }) => {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Navbar />
      {children}
    </>
  );
};

export default Layout;
