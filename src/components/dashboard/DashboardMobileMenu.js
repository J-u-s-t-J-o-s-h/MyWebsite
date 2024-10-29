import React from 'react';

const DashboardMobileMenu = ({ toggleMenu }) => {
  return (
    <button
      onClick={toggleMenu}
      className="fixed top-4 right-4 z-50 bg-gray-800 p-2 rounded-lg text-white hover:bg-gray-700"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
      </svg>
    </button>
  );
};

export default DashboardMobileMenu; 