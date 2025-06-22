const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Data file paths
const menuDataPath = path.join(__dirname, 'data', 'menu.json');
const ordersDataPath = path.join(__dirname, 'data', 'orders.json');

// Ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = path.join(__dirname, 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir);
  }
}

// Initialize default data files
async function initializeDataFiles() {
  await ensureDataDirectory();
  
  // Initialize menu.json if it doesn't exist
  try {
    await fs.access(menuDataPath);
  } catch {
    const defaultMenu = [
      {
        id: 1,
        name: "Margherita Pizza",
        description: "Classic tomato sauce with mozzarella cheese",
        price: 12.99,
        category: "Pizza",
        image: "https://source.unsplash.com/300x200/?margherita,pizza,food",
        available: true
      },
      {
        id: 2,
        name: "Pepperoni Pizza",
        description: "Spicy pepperoni with melted cheese",
        price: 14.99,
        category: "Pizza",
        image: "https://source.unsplash.com/300x200/?pepperoni,pizza,food",
        available: true
      },
      {
        id: 3,
        name: "Caesar Salad",
        description: "Fresh romaine lettuce with caesar dressing",
        price: 8.99,
        category: "Salad",
        image: "https://source.unsplash.com/300x200/?caesar,salad,food",
        available: true
      },
      {
        id: 4,
        name: "Chicken Wings",
        description: "Crispy wings with your choice of sauce",
        price: 10.99,
        category: "Appetizer",
        image: "https://source.unsplash.com/300x200/?chicken,wings,food",
        available: true
      },
      {
        id: 5,
        name: "Pasta Carbonara",
        description: "Creamy pasta with bacon and parmesan",
        price: 13.99,
        category: "Pasta",
        image: "https://source.unsplash.com/300x200/?pasta,carbonara,food",
        available: true
      }
    ];
    await fs.writeFile(menuDataPath, JSON.stringify(defaultMenu, null, 2));
  }

  // Initialize orders.json if it doesn't exist
  try {
    await fs.access(ordersDataPath);
  } catch {
    await fs.writeFile(ordersDataPath, JSON.stringify([], null, 2));
  }
}

// Routes

// Get all menu items
app.get('/api/menu', async (req, res) => {
  try {
    const menuData = await fs.readFile(menuDataPath, 'utf8');
    const menu = JSON.parse(menuData);
    res.json(menu);
  } catch (error) {
    console.error('Error reading menu:', error);
    res.status(500).json({ error: 'Failed to fetch menu' });
  }
});

// Get menu items by category
app.get('/api/menu/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const menuData = await fs.readFile(menuDataPath, 'utf8');
    const menu = JSON.parse(menuData);
    const filteredMenu = menu.filter(item => 
      item.category.toLowerCase() === category.toLowerCase()
    );
    res.json(filteredMenu);
  } catch (error) {
    console.error('Error filtering menu:', error);
    res.status(500).json({ error: 'Failed to filter menu' });
  }
});

// Add new menu item
app.post('/api/menu', async (req, res) => {
  try {
    const menuData = await fs.readFile(menuDataPath, 'utf8');
    const menu = JSON.parse(menuData);
    
    const newItem = {
      id: Math.max(...menu.map(item => item.id)) + 1,
      ...req.body,
      available: true
    };
    
    menu.push(newItem);
    await fs.writeFile(menuDataPath, JSON.stringify(menu, null, 2));
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error adding menu item:', error);
    res.status(500).json({ error: 'Failed to add menu item' });
  }
});

// Update menu item
app.put('/api/menu/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const menuData = await fs.readFile(menuDataPath, 'utf8');
    const menu = JSON.parse(menuData);
    
    const itemIndex = menu.findIndex(item => item.id === parseInt(id));
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    
    menu[itemIndex] = { ...menu[itemIndex], ...req.body };
    await fs.writeFile(menuDataPath, JSON.stringify(menu, null, 2));
    res.json(menu[itemIndex]);
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({ error: 'Failed to update menu item' });
  }
});

// Delete menu item
app.delete('/api/menu/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const menuData = await fs.readFile(menuDataPath, 'utf8');
    const menu = JSON.parse(menuData);
    
    const filteredMenu = menu.filter(item => item.id !== parseInt(id));
    await fs.writeFile(menuDataPath, JSON.stringify(filteredMenu, null, 2));
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({ error: 'Failed to delete menu item' });
  }
});

// Get all orders
app.get('/api/orders', async (req, res) => {
  try {
    const ordersData = await fs.readFile(ordersDataPath, 'utf8');
    const orders = JSON.parse(ordersData);
    res.json(orders);
  } catch (error) {
    console.error('Error reading orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Create new order
app.post('/api/orders', async (req, res) => {
  try {
    const ordersData = await fs.readFile(ordersDataPath, 'utf8');
    const orders = JSON.parse(ordersData);
    
    const newOrder = {
      id: orders.length > 0 ? Math.max(...orders.map(order => order.id)) + 1 : 1,
      ...req.body,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    orders.push(newOrder);
    await fs.writeFile(ordersDataPath, JSON.stringify(orders, null, 2));
    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Update order status
app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const ordersData = await fs.readFile(ordersDataPath, 'utf8');
    const orders = JSON.parse(ordersData);
    
    const orderIndex = orders.findIndex(order => order.id === parseInt(id));
    if (orderIndex === -1) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    orders[orderIndex].status = status;
    await fs.writeFile(ordersDataPath, JSON.stringify(orders, null, 2));
    res.json(orders[orderIndex]);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Get order by ID
app.get('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const ordersData = await fs.readFile(ordersDataPath, 'utf8');
    const orders = JSON.parse(ordersData);
    
    const order = orders.find(order => order.id === parseInt(id));
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Start server
async function startServer() {
  await initializeDataFiles();
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
  });
}

startServer().catch(console.error); 