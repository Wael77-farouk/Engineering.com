import React, { useState, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaSearch,
  FaBars,
  FaTimes,
  FaSignOutAlt,
} from "react-icons/fa";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // ⬇️ لإظهار/إخفاء قائمة البروفايل
  const [showMenu, setShowMenu] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setShowMenu(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowMenu(false);
    }, 200); // ⏱️ تأخير بسيط
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="bg-blue-800 text-white">
      {/* العلوي */}
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-tight">
          منصة الهندسة المدنية
        </Link>

        {/* Links – hidden on small screens */}
        <nav className="hidden md:flex gap-6 text-sm items-center">
          <NavLink to="/" className="hover:text-yellow-300">
            الرئيسية
          </NavLink>
          <NavLink to="/upload" className="hover:text-yellow-300">
            رفع مشروع
          </NavLink>
          <NavLink to="/profile" className="hover:text-yellow-300">
            مشاريعي
          </NavLink>
          <NavLink to="/about" className="hover:text-yellow-300">
            عن المنصة
          </NavLink>
          <NavLink to="/contact" className="hover:text-yellow-300">
            تواصل معنا
          </NavLink>
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-5">
          {/* 🔍 أيقونة البحث */}
          <FaSearch
            className="cursor-pointer hover:text-yellow-300"
            onClick={() => navigate("/?focus=search")}
          />

          {token ? (
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <FaUser className="cursor-pointer" />
              {showMenu && (
                <div className="absolute right-0 top-6 bg-white text-gray-700 w-40 shadow-md rounded-md z-50 text-sm">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    صفحتي
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-red-600"
                  >
                    <FaSignOutAlt /> خروج
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <FaUser className="hover:text-yellow-300" />
            </Link>
          )}

          {/* Menu Icon for mobile */}
          <FaBars
            onClick={() => setVisible(true)}
            className="md:hidden cursor-pointer"
          />
        </div>
      </div>

      {/* Sidebar for mobile */}
      <div
        className={`fixed top-0 right-0 h-full z-50 bg-white text-gray-800 w-64 shadow-lg transform transition-transform duration-300 ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <p className="font-bold">القائمة</p>
          <FaTimes onClick={() => setVisible(false)} className="cursor-pointer" />
        </div>
        <nav className="flex flex-col gap-2 p-4">
          <NavLink
            to="/"
            onClick={() => setVisible(false)}
            className="hover:bg-gray-100 p-2 rounded"
          >
            الرئيسية
          </NavLink>
          <NavLink
            to="/upload"
            onClick={() => setVisible(false)}
            className="hover:bg-gray-100 p-2 rounded"
          >
            رفع مشروع
          </NavLink>
          <NavLink
            to="/profile"
            onClick={() => setVisible(false)}
            className="hover:bg-gray-100 p-2 rounded"
          >
            مشاريعي
          </NavLink>
          <NavLink
            to="/about"
            onClick={() => setVisible(false)}
            className="hover:bg-gray-100 p-2 rounded"
          >
            عن المنصة
          </NavLink>
          <NavLink
            to="/contact"
            onClick={() => setVisible(false)}
            className="hover:bg-gray-100 p-2 rounded"
          >
            تواصل معنا
          </NavLink>
          {token ? (
            <button
              onClick={() => {
                logout();
                setVisible(false);
              }}
              className="text-red-600 hover:bg-red-100 p-2 rounded"
            >
              تسجيل الخروج
            </button>
          ) : (
            <NavLink
              to="/login"
              onClick={() => setVisible(false)}
              className="hover:bg-gray-100 p-2 rounded"
            >
              تسجيل الدخول
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
