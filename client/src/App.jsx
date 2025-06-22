import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import Header from './components/Header';
import Menu from './components/Menu';
import Cart from './components/Cart';
import { selectCartItems, selectCartTotal, selectCartItemCount, clearCart } from './store/cartSlice';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const cartItemCount = useSelector(selectCartItemCount);
  
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Fetch menu items from API
  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/menu');
      console.log('Menu items loaded:', response.data);
      setMenuItems(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load menu items. Please try again later.');
      console.error('Error fetching menu:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories
  const categories = ['all', ...new Set(menuItems.map(item => item.category))];

  // Place order
  const placeOrder = async (customerInfo) => {
    try {
      const orderData = {
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        totalAmount: cartTotal
      };

      await axios.post('/api/orders', orderData);
      
      // Clear cart and show success message
      dispatch(clearCart());
      setIsCartOpen(false);
      setOrderSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setOrderSuccess(false), 3000);
      
    } catch (err) {
      setError('Failed to place order. Please try again.');
      console.error('Error placing order:', err);
    }
  };

  return (
    <div className="App">
      <Header 
        cartItemCount={cartItemCount}
        onCartClick={() => setIsCartOpen(true)}
      />
      
      <main className="main-content">
        <div className="container">
          {orderSuccess && (
            <div className="success-message">
              Order placed successfully! Thank you for your order.
            </div>
          )}
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <Menu
            menuItems={menuItems}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            loading={loading}
          />
        </div>
      </main>

      {isCartOpen && (
        <Cart
          cart={cartItems}
          cartTotal={cartTotal}
          onClose={() => setIsCartOpen(false)}
          onPlaceOrder={placeOrder}
        />
      )}
    </div>
  );
}

export default App; 