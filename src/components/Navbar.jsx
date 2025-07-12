import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 `}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold text-lime-300 italic">AI Interview</div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-6 text-lime-200 font-medium text-base">
          <Link to="/" className="hover:text-lime-400 transition">Home</Link>
          <Link to="/practice" className="hover:text-lime-400 transition">Practice</Link>
          <Link to="/about" className="hover:text-lime-400 transition">About</Link>
          <Link to="/contact" className="hover:text-lime-400 transition">Contact</Link>
        </ul>

        {/* Mobile Menu Icon */}
        <div className="md:hidden text-lime-200 text-2xl cursor-pointer" onClick={toggleMenu}>
          {menuOpen ? <FiX /> : <FiMenu />}
        </div>
      </div>

      {/* Mobile Menu Items */}
      {menuOpen && (
        <ul className="md:hidden bg-green-900 text-lime-200 flex flex-col items-center gap-4 py-4 text-lg font-medium">
          <Link to="/" onClick={toggleMenu} className="hover:text-lime-400">Home</Link>
          <Link to="/practice" onClick={toggleMenu} className="hover:text-lime-400">Practice</Link>
          <Link to="/about" onClick={toggleMenu} className="hover:text-lime-400">About</Link>
          <Link to="/contact" onClick={toggleMenu} className="hover:text-lime-400">Contact</Link>
        </ul>
      )}
    </nav>
  );
};

export default NavBar;
