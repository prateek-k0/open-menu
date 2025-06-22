# Online Menu Server

Backend server for the online menu ordering platform built with Node.js and Express.js.

## Features

- RESTful API for menu management
- Order processing and tracking
- JSON file-based data storage
- CORS enabled for cross-origin requests

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Menu Management

- `GET /api/menu` - Get all menu items
- `GET /api/menu/category/:category` - Get menu items by category
- `POST /api/menu` - Add new menu item
- `PUT /api/menu/:id` - Update menu item
- `DELETE /api/menu/:id` - Delete menu item

### Order Management

- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update order status

### Health Check

- `GET /api/health` - Server health status

## Data Structure

### Menu Item
```json
{
  "id": 1,
  "name": "Margherita Pizza",
  "description": "Classic tomato sauce with mozzarella cheese",
  "price": 12.99,
  "category": "Pizza",
  "image": "https://via.placeholder.com/300x200?text=Margherita+Pizza",
  "available": true
}
```

### Order
```json
{
  "id": 1,
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "+1234567890",
  "items": [
    {
      "id": 1,
      "name": "Margherita Pizza",
      "price": 12.99,
      "quantity": 2
    }
  ],
  "totalAmount": 25.98,
  "status": "pending",
  "createdAt": "2024-01-01T12:00:00.000Z"
}
```

## Data Storage

The application uses JSON files for data storage:
- `data/menu.json` - Menu items
- `data/orders.json` - Orders

These files are automatically created with sample data when the server starts for the first time. 