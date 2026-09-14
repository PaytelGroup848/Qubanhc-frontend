import useMediaQuery from "../components/Navbar/useMediaQuery";
import Navbar from "../components/Navbar/Navbar";          // Desktop only
import MobileNavbar from "../components/Navbar/MobileNavbar"; // Mobile only
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

export default function Layout() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <div className="min-h-screen flex flex-col">
      {isDesktop ? <Navbar /> : <MobileNavbar />}
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}