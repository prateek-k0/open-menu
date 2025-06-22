import React from 'react';

function Header({ cartItemCount, onCartClick }) {
  return (
    <header className="header">
      <div className="container --header">
        <div className="header-content">
          <div className="logo">
            🍽️ Online Menu
          </div>
          
          <nav className="nav">
            <a href="#" className="nav-link">Home</a>
            <a href="#" className="nav-link">About</a>
            <a href="#" className="nav-link">Contact</a>
            
            <div className="cart-icon" onClick={onCartClick}>
              🛒
              {cartItemCount > 0 && (
                <span className="cart-count">{cartItemCount}</span>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header; 