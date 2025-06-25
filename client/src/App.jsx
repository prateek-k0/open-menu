import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import Header from './components/Header';
import Menu from './components/Menu';
import Cart from './components/Cart';
import CustomizeModal from './components/CustomizeModal';
import { selectCartItems, selectCartTotal, selectCartItemCount, clearCart, addToCart } from './store/cartSlice';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const cartItemCount = useSelector(selectCartItemCount);

  console.log(cartItems)
  
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [customizeModal, setCustomizeModal] = useState({
    isOpen: false,
    item: null
  });

  // Fetch menu items from API
  useEffect(() => {
    fetchMenuItems();
  }, []);

  // Disable scrolling when customize modal is open
  useEffect(() => {
    if (customizeModal.isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [customizeModal.isOpen]);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/menu');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setMenuItems(data);
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

  // Handle opening customize modal
  const handleOpenCustomizeModal = (item) => {
    setCustomizeModal({
      isOpen: true,
      item: item
    });
  };

  // Handle closing customize modal
  const handleCloseCustomizeModal = () => {
    setCustomizeModal({
      isOpen: false,
      item: null
    });
  };

  // Handle confirming quantity from modal
  const handleConfirmQuantity = (quantity, cookingInstructions) => {
    if (customizeModal.item) {
      dispatch(addToCart({ 
        item: customizeModal.item, 
        quantity,
        cookingInstructions: cookingInstructions || ''
      }));
      toast.success(`${quantity} ${quantity === 1 ? customizeModal.item.name : customizeModal.item.name + 's'} added to cart!`);
      handleCloseCustomizeModal();
    }
  };

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

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      
      // Clear cart and show success message
      dispatch(clearCart());
      setIsCartOpen(false);
      setOrderSuccess(true);
      toast.success('Order placed successfully! Thank you for your order.');
      
      // Hide success message after 3 seconds
      setTimeout(() => setOrderSuccess(false), 3000);
      
    } catch (err) {
      setError('Failed to place order. Please try again.');
      toast.error('Failed to place order. Please try again.');
      console.error('Error placing order:', err);
    }
  };

  return (
    <div className="App">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
        }}
      />
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
            onOpenCustomizeModal={handleOpenCustomizeModal}
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

      <CustomizeModal
        isOpen={customizeModal.isOpen}
        onClose={handleCloseCustomizeModal}
        onConfirm={handleConfirmQuantity}
        itemName={customizeModal.item?.name || ''}
        item={customizeModal.item}
      />
    </div>
  );
}

export default App; 