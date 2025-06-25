import React, { useState } from 'react';

function EditItemModal({ item, onClose, onConfirm }) {
  const [quantity, setQuantity] = useState(item.quantity);
  const [cookingInstructions, setCookingInstructions] = useState(item.cookingInstructions || '');

  const handleConfirm = () => {
    onConfirm(item.id, quantity, cookingInstructions);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-banner">
          <div className="modal-banner-placeholder">
            <div className="placeholder-icon">✏️</div>
            <div className="placeholder-text">Edit {item.name}</div>
          </div>
          <div className="modal-banner-overlay">
            <h3>Edit Item</h3>
            <button className="modal-close" onClick={handleClose}>
              ×
            </button>
          </div>
        </div>
        <div className="modal-body">
          <div className="quantity-section">
            <p>How many <strong>{item.name}</strong> would you like?</p>
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
            <label htmlFor="edit-cooking-instructions" className="instructions-label">
              Cooking Instructions (Optional)
            </label>
            <textarea
              id="edit-cooking-instructions"
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
            Update Item
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditItemModal; 