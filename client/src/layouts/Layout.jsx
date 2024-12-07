import { Link, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Layout() {
  return (
    <div className="w-full min-h-screen">
      <Navbar />
      <Outlet />
      {/* <Footer /> */}
    </div>
  );
}
