import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { removeFromCart, updateQuantity, updateItem } from '../store/cartSlice';
import EditItemModal from './EditItemModal';

function Cart({ cart, cartTotal, onClose, onPlaceOrder }) {
  const dispatch = useDispatch();
  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const handleInputChange = (e) => {
    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await onPlaceOrder(customerInfo);
    setSubmitting(false);
    setCustomerInfo({ name: '', email: '', phone: '' });
  };

  const handleRemoveItem = (itemId) => {
    const item = cart.find(cartItem => cartItem.id === itemId);
    dispatch(removeFromCart(itemId));
    toast.success(`${item.name} removed from cart`);
  };

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      const item = cart.find(cartItem => cartItem.id === itemId);
      dispatch(removeFromCart(itemId));
      toast.success(`${item.name} removed from cart`);
    } else {
      dispatch(updateQuantity({ itemId, newQuantity }));
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
  };

  const handleCloseEditModal = () => {
    setEditingItem(null);
  };

  const handleConfirmEdit = (itemId, newQuantity, newInstructions) => {
    dispatch(updateItem({ 
      itemId, 
      quantity: newQuantity, 
      cookingInstructions: newInstructions 
    }));
    toast.success('Item updated successfully!');
    setEditingItem(null);
  };

  return (
    <>
      <div className="cart-modal">
        <div className="cart-content">
          <div className="cart-header">
            <div className="cart-title">Your Cart</div>
            <button className="close-btn" onClick={onClose}>&times;</button>
          </div>

          {cart.length === 0 ? (
            <div className="empty-cart">Your cart is empty.</div>
          ) : (
            <>
              <div className="cart-items">
                {cart.map(item => (
                  <div className="cart-item" key={item.id}>
                    <div className="cart-item-info">
                      <div className="cart-item-name">{item.name}</div>
                      <div className="cart-item-price">${item.price.toFixed(2)}</div>
                      {item.cookingInstructions && (
                        <div className="cart-item-instructions">
                          <span className="instructions-label">Instructions:</span>
                          <span className="instructions-text">{item.cookingInstructions}</span>
                        </div>
                      )}
                    </div>
                    <div className="cart-item-actions">
                      <div className="cart-item-quantity">
                        <button
                          className="quantity-btn"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="quantity-display">{item.quantity}</span>
                        <button
                          className="quantity-btn"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="edit-btn"
                        onClick={() => handleEditItem(item)}
                        aria-label="Edit item"
                      >
                        ✏️
                      </button>
                      <button
                        className="close-btn"
                        onClick={() => handleRemoveItem(item.id)}
                        aria-label="Remove item"
                      >
                        &times;
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-total">Total: ${cartTotal.toFixed(2)}</div>

              <form className="checkout-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="name">Name</label>
                  <input
                    className="form-input"
                    type="text"
                    id="name"
                    name="name"
                    value={customerInfo.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email</label>
                  <input
                    className="form-input"
                    type="email"
                    id="email"
                    name="email"
                    value={customerInfo.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="phone">Phone</label>
                  <input
                    className="form-input"
                    type="tel"
                    id="phone"
                    name="phone"
                    value={customerInfo.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <button
                  className="checkout-btn"
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? 'Placing Order...' : 'Place Order'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      {editingItem && (
        <EditItemModal
          item={editingItem}
          onClose={handleCloseEditModal}
          onConfirm={handleConfirmEdit}
        />
      )}
    </>
  );
}

export default Cart; 