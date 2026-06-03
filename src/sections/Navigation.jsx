import React from 'react';
import ThemeToggle from '../components/ThemeToggle';
import kairoLogo from '../assets/kairo-logo.png';

export default function Navigation() {
  return (
    <nav>
      <div className="container nav-content">
        <a href="/" className="nav-brand" aria-label="Kairo home">
          <img src={kairoLogo} alt="Kairo" className="brand-logo-img" />
        </a>
        <div className="nav-links hide-mobile">
          <a href="#product">Product</a>
          <a href="#use-cases">Use Cases</a>
        </div>
        <div className="flex items-center gap-md">
          <ThemeToggle className="hide-mobile" />
          <a href="/dashboard/login" className="btn btn-ghost hide-mobile">Log in</a>
          <a href="/dashboard/register" className="btn btn-primary">Sign up</a>
        </div>
      </div>
    </nav>
  );
}
