import React, { useState } from 'react';

function CustomizeModal({ isOpen, onClose, onConfirm, itemName, item }) {
  const [quantity, setQuantity] = useState(1);
  const [cookingInstructions, setCookingInstructions] = useState('');
  const [imgSrc, setImgSrc] = useState(item?.image || getUnsplashImage(itemName));

  function getUnsplashImage(query) {
    // Use Unsplash random food image with query fallback
    const encoded = encodeURIComponent(query || 'food');
    return `https://source.unsplash.com/400x200/?${encoded},food`;
  }

  const handleImageError = () => {
    // If the current src is not already Unsplash, fallback to Unsplash
    if (!imgSrc.startsWith('https://source.unsplash.com')) {
      setImgSrc(getUnsplashImage(itemName));
    } else {
      // If Unsplash also fails, fallback to a generic placeholder
      setImgSrc('https://via.placeholder.com/400x200?text=No+Image');
    }
  };

  const handleConfirm = () => {
    onConfirm(quantity, cookingInstructions);
    setQuantity(1);
    setCookingInstructions('');
    onClose();
  };

  const handleClose = () => {
    setQuantity(1);
    setCookingInstructions('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-banner">
          {/* <img
            src={imgSrc}
            alt={itemName}
            className="modal-banner-image"
            onError={handleImageError}
          /> */}
          <div className="modal-banner-placeholder">
            <div className="placeholder-icon">🍽️</div>
            <div className="placeholder-text">{itemName}</div>
          </div>
          <div className="modal-banner-overlay">
            <h3>Customize Your Order</h3>
            <button className="modal-close" onClick={handleClose}>
              ×
            </button>
          </div>
        </div>
        <div className="modal-body">
          <div className="quantity-section">
            <p>How many <strong>{itemName}</strong> would you like to add?</p>
            <div className="quantity-controls">
              <button
                className="quantity-btn"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="quantity-display">{quantity}</span>
              <button
                className="quantity-btn"
                onClick={() => setQuantity(q => q + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>
          
          <div className="instructions-section">
            <label htmlFor="cooking-instructions" className="instructions-label">
              Cooking Instructions (Optional)
            </label>
            <textarea
              id="cooking-instructions"
              className="cooking-instructions"
              placeholder="e.g., spicy, less oily, sweeter, extra crispy, well done..."
              value={cookingInstructions}
              onChange={(e) => setCookingInstructions(e.target.value)}
              rows="3"
              maxLength="200"
            />
            <div className="char-count">
              {cookingInstructions.length}/200 characters
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={handleClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleConfirm}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default CustomizeModal; 