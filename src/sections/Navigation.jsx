import React from 'react';

export default function Navigation() {
  return (
    <nav>
      <div className="container nav-content">
        <div className="serif text-xl">Kairo</div>
        <div className="nav-links hide-mobile">
          <a href="#product">Product</a>
          <a href="#use-cases">Use Cases</a>
        </div>
        <div className="flex items-center gap-md">
          <a href="/dashboard/login" className="btn btn-ghost hide-mobile">Log in</a>
          <a href="/dashboard/login" className="btn btn-primary">Start Free</a>
        </div>
      </div>
    </nav>
  );
}
