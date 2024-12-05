import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavBar: React.FC = () => {
  const location = useLocation();

  return (
    <header className="header">
      <nav className="nav-bar" role="navigation" aria-label="Main navigation">
        <div className="logo" role="img" aria-label="NZ Property Appraisal Logo">NZ Property Appraisal</div>
        <div className="nav-links">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
          <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Link>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
