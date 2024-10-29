import React, { useState } from 'react';
import DashboardNavigation from '../dashboard/DashboardNavigation';
import DashboardMobileMenu from '../dashboard/DashboardMobileMenu';

const Layout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <DashboardMobileMenu toggleMenu={toggleMenu} />
      <DashboardNavigation isOpen={isMenuOpen} toggleMenu={toggleMenu} />
      
      {/* Overlay when menu is open on mobile */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMenu}
        />
      )}
      
      {/* Main content */}
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
};

export default Layout; 