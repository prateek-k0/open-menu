import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { addToCart } from '../store/cartSlice';

function MenuItem({ item, onOpenCustomizeModal }) {
  const dispatch = useDispatch();
  const [imgSrc, setImgSrc] = useState(item.image || getUnsplashImage(item.name));

  function getUnsplashImage(query) {
    // Use Unsplash random food image with query fallback
    const encoded = encodeURIComponent(query || 'food');
    return `https://source.unsplash.com/300x200/?${encoded},food`;
  }

  const handleAddToCartClick = () => {
    if (item.available) {
      onOpenCustomizeModal(item);
    }
  };

  const handleImageError = () => {
    // If the current src is not already Unsplash, fallback to Unsplash
    if (!imgSrc.startsWith('https://source.unsplash.com')) {
      setImgSrc(getUnsplashImage(item.name));
    } else {
      // If Unsplash also fails, fallback to a generic placeholder
      setImgSrc('https://via.placeholder.com/300x200?text=No+Image');
    }
  };

  return (
    <div className="menu-item">
      <img
        src={imgSrc}
        alt={item.name}
        className="menu-item-image"
        onError={handleImageError}
      />
      <div className="menu-item-content">
        <div className="menu-item-title">{item.name}</div>
        <div className="menu-item-description">{item.description}</div>
        <div className="menu-item-price">${item.price.toFixed(2)}</div>
        <div className="menu-item-actions">
          <button
            className="add-to-cart-btn"
            onClick={handleAddToCartClick}
            disabled={!item.available}
          >
            {item.available ? 'Add to Cart' : 'Unavailable'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MenuItem; 