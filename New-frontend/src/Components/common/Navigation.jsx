import { Link, useNavigate } from "react-router-dom";
import { Heart, Menu, PawPrint, User } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NotificationBell from "../NotificationBell";
import { useAuth } from "../../contexts/AuthContext";
import "./Navigation.css";

const Navigation = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigate = (path) => {
    setIsMobileMenuOpen(false);
    navigate(path);
  };

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

          {user && user.is_staff && (
            <Link to="/admin" className="nav-link-A">
              Admin
            </Link>)}

            <Link to="/adopt" className="nav-link">
              Adopt
            </Link>

            <Link to="/lost-found" className="nav-link">
              Lost & Found
            </Link>

            <Link to="/about" className="nav-link">
              About
            </Link>
          </nav>
        </div>

        <div className="nav-actions">

          {user && (
          <NotificationBell/>)}
          
          {user && (
          <button
            className="icon-btn heart-btn"
            onClick={() => navigate("/favorites")}>
            <Heart size={20} />
            <span className="heart-dot" />
          </button>)}

          {user && (
            <button
              className="user-avatar-btn1"
              onClick={() => navigate("/user-dashboard")}
              aria-label="User dashboard">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="User Avatar"
                  className="user-avatar-img1"
                />
              ) : (
                <User className="user-avatar-icon1" />
              )}
            </button>
          )}

          <button
            className="icon-btn mobile-only"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}>
            <Menu size={20} />
          </button>

          {!user && (
            <button className="cta-btn hide-md"
            onClick={() => navigate("/login")}>
              Login </button>)}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="mobile-menu1">
            <div className="mobile-menu-content">
              <button
                className="mobile-link1"
                onClick={() => handleNavigate("/adopt")}>
                Adopt
              </button>

              <button
                className="mobile-link1"
                onClick={() => handleNavigate("/lost-found")}>
                Lost & Found
              </button>

              <button
                className="mobile-link1"
                onClick={() => handleNavigate("/admin")}>
                Admin
              </button>

              <button
                className="mobile-link1"
                onClick={() => handleNavigate("/about")}>
                About
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navigation;

