import React, { useRef, useEffect } from 'react';
import MenuItem from './MenuItem';

function Menu({ menuItems, categories, selectedCategory, onCategoryChange, onAddToCart, loading }) {
  const categoryRefs = useRef({});

  // Group menu items by category
  const menuByCategory = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  // Get categories that have items (excluding 'all')
  const availableCategories = Object.keys(menuByCategory);

  // Set up intersection observers for automatic category highlighting
  useEffect(() => {
    const observers = [];
    
    // Create intersection observer for each category
    availableCategories.forEach(category => {
      const element = categoryRefs.current[category];
      if (element) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                console.log('category in view:', category);
                onCategoryChange(category);
              }
            });
          },
          {
            root: null,
            rootMargin: '-200px', // Trigger when category is in upper portion of viewport
            threshold: 0.1
          }
        );
        
        observer.observe(element);
        observers.push(observer);
      }
    });

    // Cleanup function
    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, [menuItems]);

  // Handle category filter click with smooth scrolling
  const handleCategoryClick = (category) => {
    onCategoryChange(category);
    
    // Add a small delay to ensure state update
    setTimeout(() => {
      // Scroll to specific category
      const categoryElement = categoryRefs.current[category];
      if (categoryElement) {
        categoryElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
      } 
    }, 50);
  };

  // Set ref for a category element
  const setCategoryRef = (category, element) => {
    if (element) {
      categoryRefs.current[category] = element;
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <h2>Loading menu...</h2>
      </div>
    );
  }

  return (
    <div>
      {availableCategories.length === 0 ? (
        <div className="loading">
          <h2>No items found in this category.</h2>
        </div>
      ) : (
        <div className="menu-categories">
          {availableCategories.map(category => (
            <div 
              key={category} 
              className="menu-category"
              ref={(el) => setCategoryRef(category, el)}
              id={`category-${category}`}
            >
              <h2 className="category-title">{category}</h2>
              <div className="menu-grid">
                {menuByCategory[category].map(item => (
                  <MenuItem
                    key={item.id}
                    item={item}
                    onAddToCart={onAddToCart}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fixed floating category filter */}
      <div className="category-filter">
        {categories.filter(category => category !== 'all').map(category => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Menu; 