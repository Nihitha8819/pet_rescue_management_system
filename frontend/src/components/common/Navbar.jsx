import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { Menu, X, Bell } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { unreadCount, notifications, markAsRead, markAllAsRead } = useNotification();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = user?.role === 'admin' || user?.is_staff;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navClass = ({ isActive }) =>
    `relative transition hover:text-emerald-400 ${
      isActive
        ? 'text-emerald-400 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-emerald-400'
        : ''
    }`;

  return (
    <nav className="fixed top-0 w-full z-50 bg-black text-white shadow-md">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-16">

          {/* LOGO */}
          <NavLink to="/" className="text-xl font-bold">
            🐾 <span className="text-gradient">PetRescue</span>
          </NavLink>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-6">

            {!user && (
              <>
                <NavLink to="/" className={navClass}>Home</NavLink>
                <NavLink to="/adopt" className={navClass}>Adopt</NavLink>
              </>
            )}

            {user && !isAdmin && (
              <>
                <NavLink to="/" className={navClass}>Home</NavLink>
                <NavLink to="/adopt" className={navClass}>Adopt</NavLink>
                <NavLink to="/report-pet" className={navClass}>Report Pet</NavLink>
                <NavLink to="/dashboard" className={navClass}>Dashboard</NavLink>
                <NavLink to="/register-pet" className={navClass}>Register Pet</NavLink>

              </>
            )}

            {user && isAdmin && (
              <>
                <NavLink to="/admin" className={navClass}>Dashboard</NavLink>
                <NavLink to="/admin/reports" className={navClass}>Reports</NavLink>
                <NavLink to="/admin/pets" className={navClass}>Pets</NavLink>
                <NavLink to="/admin/adoptions" className={navClass}>Adoptions</NavLink>
                <NavLink to="/admin/users" className={navClass}>Users</NavLink>
                <NavLink to="/admin/analytics" className={navClass}>Analytics</NavLink>
              </>
            )}

            {user ? (
              <div className="flex items-center gap-4">
                <NotificationBell
                  unreadCount={unreadCount}
                  notifications={notifications}
                  markAsRead={markAsRead}
                />
              <ProfileAvatar user={user} onLogout={handleLogout} />
              </div>
            ) : (
              <>
                <NavLink to="/login" className={navClass}>Login</NavLink>
                <NavLink
                  to="/signup"
                  className="bg-emerald-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-emerald-600 transition"
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </div>

          {/* MOBILE BUTTON */}
          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="md:hidden bg-black border-t border-gray-800 px-6 py-4 space-y-4">

          {user && isAdmin ? (
            <>
              <NavLink to="/admin" onClick={() => setMobileOpen(false)}>Dashboard</NavLink>
              <NavLink to="/admin/reports" onClick={() => setMobileOpen(false)}>Reports</NavLink>
              <NavLink to="/admin/pets" onClick={() => setMobileOpen(false)}>Pets</NavLink>
              <NavLink to="/admin/adoptions" onClick={() => setMobileOpen(false)}>Adoptions</NavLink>
              <NavLink to="/admin/users" onClick={() => setMobileOpen(false)}>Users</NavLink>
              <NavLink to="/admin/analytics" onClick={() => setMobileOpen(false)}>Analytics</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/" onClick={() => setMobileOpen(false)}>Home</NavLink>
              <NavLink to="/adopt" onClick={() => setMobileOpen(false)}>Adopt</NavLink>
              <NavLink to="/report-pet" onClick={() => setMobileOpen(false)}>Report Pet</NavLink>
              {user && (
                <>
                  <NavLink to="/dashboard" onClick={() => setMobileOpen(false)}>Dashboard</NavLink>
                  <NavLink to="/register-pet" onClick={() => setMobileOpen(false)}>Register Pet</NavLink>
                </>
              )}
            </>
          )}

          {user && (
            <>
              <button
                onClick={() => {
                  navigate('/settings');
                  setMobileOpen(false);
                }}
                className="block hover:text-emerald-400"
              >
                ⚙️ Settings
              </button>

              <button
                onClick={handleLogout}
                className="block text-red-400 hover:text-red-500"
              >
                🚪 Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

/* ---------- PROFILE AVATAR ---------- */

const ProfileAvatar = ({ user, onLogout }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-black font-bold"
      >
        {user.name?.charAt(0).toUpperCase()}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-56 bg-white text-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="px-4 py-3 border-b">
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>

          <button
            onClick={() => navigate('/settings')}
            className="w-full text-left px-4 py-3 hover:bg-gray-100"
          >
            ⚙️ Settings
          </button>

          <button
            onClick={onLogout}
            className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600"
          >
            🚪 Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;

const NotificationBell = ({ unreadCount, notifications, markAsRead, markAllAsRead }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-gray-800 transition"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-72 bg-white text-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="px-4 py-2 border-b flex items-center justify-between">
            <span className="font-semibold text-sm">Notifications</span>
            {unreadCount > 0 && (
              <span className="text-xs text-gray-500">{unreadCount} unread</span>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-4 text-sm text-gray-500">
                No notifications yet.
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className={`w-full text-left px-4 py-3 text-sm border-b last:border-b-0 ${
                    n.is_read ? 'bg-white' : 'bg-emerald-50'
                  }`}
                >
                  <p className="text-gray-800">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(n.created_at).toLocaleString()}
                  </p>
                </button>
              ))
            )}
          </div>
          {notifications.length > 0 && (
            <button
              onClick={markAllAsRead}
              className="w-full text-center text-xs text-emerald-600 py-2 hover:bg-gray-50 border-t"
            >
              Mark all as read
            </button>
          )}
        </div>
      )}
    </div>
  );
}
