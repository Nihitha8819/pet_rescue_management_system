import { Link, useNavigate } from "react-router-dom";
import { Heart, Menu, Search, User, PawPrint } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Navigation.css";

const Navigation = () => {
  const navigate = useNavigate(); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="nav-header">
      <div className="nav-container">
        <div className="nav-left">
          <Link to="/" className="brand">
            <div className="brand-icon">
              <PawPrint size={22} />
            </div>
            <span className="brand-text">PetRescue</span>
          </Link>

          <nav className="nav-links">

            <Link to="/adminlogin" className="nav-link-A" >Admin</Link>

            <Link to="/AdoptPage" className="nav-link" >Adopt</Link>

            <Link to="/LostFound" className="nav-link">Lost & Found</Link>

            <a href="#" className="nav-link" 
            onClick={() => {
                const aboutSection = document.getElementById("about-section");
                if (aboutSection) {
                    aboutSection.scrollIntoView({ behavior: "smooth" });
                    }}}style={{ cursor: "pointer" }}>About</a>
          </nav>
        </div>

        <div className="nav-actions">
          <button className="icon-btn hide-sm"onClick={() => navigate("/Searchpets")}>
            <Search size={20} />
          </button>

          <button className="icon-btn heart-btn">
            <Heart size={20} />
            <span className="heart-dot" />
          </button>

          <button className="icon-btn" onClick={() => navigate("/UserDashboard")}>
            <User size={20} />
          </button>

          <button
            className="icon-btn mobile-only"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu size={20} />
          </button>

          <button className="cta-btn hide-md"onClick={() => navigate("/login")}>Login</button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mobile-menu"
          >
            <div className="mobile-menu-content">
                <Link
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mobile-link">
                </Link>
                <a href="#" className="nav-link" 
                onClick={() => navigate("/AdoptPage")}
                style={{ cursor: "pointer" }}>Adopt</a>
                
                <a href="#" className="nav-link" 
                onClick={() => navigate("/LostFound")} 
                style={{ cursor: "pointer" }}>Lost & Found</a>
                
                <a href="#" className="nav-link" 
                onClick={() => navigate("/adminlogin")} 
                style={{ cursor: "pointer" }}>Admin-Login</a>
                
                <a href="#" className="nav-link" 
                onClick={() => {
                    const aboutSection = document.getElementById("about-section");
                    if (aboutSection) {
                        aboutSection.scrollIntoView({ behavior: "smooth" });
                        }}}style={{ cursor: "pointer" }}>About</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navigation;
