import { useLocation } from "react-router-dom";
import Footer from "./Footer/Footer";
import Header from "./Header/Header";
import "./Layout.css";

export default function Layout({ children }) {
  const location = useLocation();
  const isHome = location.pathname === "/";
  return (
    <div className="layout">
      <Header />
      {children}
      {isHome}
      <Footer />
    </div>
  );
}
