## Tech Stack

### Frontend

* React
* React Router
* Vite
* CSS

### Backend

* Node.js
* Express
* MongoDB
* Mongoose
* Zod

### Testing

* Jest
* Supertest

---

## Features

### Customer Management

* Create customers
* View customers
* Update customers
* Delete customers
* Search by name, phone, or email
* Pagination
* Input validation

### Product Management

* Create products
* View products
* Update products
* Delete products
* Search by product name or SKU
* Pagination
* Duplicate SKU prevention
* Price and stock validation
* Low-stock detection

### Order Management

* Create orders for customers
* Add multiple products to an order
* Automatic order total calculation
* Server-side product price calculation
* Stock availability validation
* Automatic stock reduction after successful order creation
* Order cancellation
* Stock restoration after cancellation
* Prevention of cancelling an already cancelled order
* Order search and pagination
* Customer and product information populated in order details

### Dashboard

The dashboard displays:

* Total Customers
* Total Products
* Total Orders
* Total Sales
* Low Stock Products

Cancelled orders are excluded from total sales.

---

# Prerequisites

Before running the application, install:

* Node.js 18+ recommended
* npm
* MongoDB Atlas account or a local MongoDB installation
* Git

Verify Node and npm:

```bash
node -v
npm -v
```

---

# Project Structure

```text
AppMixo/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── validators/
│   ├── tests/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── validation/
│   └── package.json
│
├── .gitignore
└── README.md
```

---

# Installation

Clone the repository:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd AppMixo
```

## Backend

```bash
cd backend
npm install
```

## Frontend

Open another terminal:

```bash
cd frontend
npm install
```

---

# Environment Variables

Create a `.env` file inside the `backend` folder.

Example:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
MONGO_TEST_URI=mongodb+srv://<username>:<password>@<cluster>/<test-database>
PORT=5000
```

Do not commit the real `.env` file.

The repository includes `.env.example` containing placeholder values only.

---

# MongoDB Setup

AppMixo uses MongoDB with Mongoose.

You can use either MongoDB Atlas or a local MongoDB server.

## MongoDB Atlas

1. Create a MongoDB Atlas cluster.
2. Create a database user.
3. Add your development IP address to the Network Access list.
4. Copy the MongoDB connection string.
5. Put the connection string in `backend/.env`.
6. Use a separate database name for automated tests.

For example:

```text
Development database:
AppMixo

Test database:
AppMixoTest
```

Using a separate test database prevents automated tests from modifying development data.

---

# MongoDB Indexes

Mongoose creates the required indexes from the schemas.

The Product model defines a unique index for SKU:

```js
sku: {
  type: String,
  required: true,
  trim: true,
  unique: true
}
```

This prevents two products from having the same SKU at the database level.

The Order model also uses a unique index for `orderNumber`:

```js
orderNumber: {
  type: String,
  required: true,
  unique: true
}
```

Indexes can be initialized by Mongoose when the application starts and the models are loaded.

---

# Seed Data

The application does not require permanent seed data to start.

Customers and products can be created through the application UI.

For evaluation, create a few customers and products first, then create orders using those records.

Recommended sample data:

### Customer

```text
Name: John Doe
Phone: 9999999999
Email: john@example.com
```

### Product

```text
Name: Wireless Mouse
SKU: WM-001
Price: 25
Stock: 20
```

### Low Stock Product

```text
Name: Keyboard
SKU: KB-001
Price: 40
Stock: 3
```

---

# Running the Application

## Start Backend

From the `backend` directory:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

## Start Frontend

From the `frontend` directory:

```bash
npm run dev
```

Vite will display the frontend URL in the terminal, normally:

```text
http://localhost:5173
```

Open that URL in your browser.

---

# API Routes

## Customers

```text
GET    /api/customers
GET    /api/customers/:id
POST   /api/customers
PUT    /api/customers/:id
DELETE /api/customers/:id
```

## Products

```text
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

## Orders

```text
POST   /api/orders
GET    /api/orders
GET    /api/orders/:id
PUT    /api/orders/:id/cancel
```

## Dashboard

```text
GET    /api/dashboard
```

---

# Automated Tests

Tests are implemented using Jest and Supertest.

Run the backend tests:

```bash
cd backend
npm test
```

The test suite covers important business logic including:

* Order total calculation
* Insufficient stock handling
* Successful order creation
* Inventory reduction after an order
* Inventory restoration after cancellation
* Duplicate SKU prevention

The tests use a separate MongoDB test database configured through:

```env
MONGO_TEST_URI=...
```

Test data is cleaned between tests so individual tests remain isolated.

---

# Architecture Decisions

## Separation of Frontend and Backend

The project uses separate React and Express applications.

```text
React frontend
      ↓
REST API
      ↓
Express backend
      ↓
Mongoose
      ↓
MongoDB
```

This keeps the UI and business logic separated and makes the backend API reusable.

## Controllers and Routes

Routes define API endpoints while controllers contain the application/business logic.

This keeps route files small and easier to maintain.

## Validation

Zod is used for request validation before order data is processed.

Mongoose schema validation provides an additional database-level validation layer.

## Server-Side Pricing

The backend does not trust product prices sent by the frontend.

When an order is created, the backend retrieves the current product price from MongoDB and calculates:

```text
line total = product price × quantity
```

The final order total is calculated by the server.

This prevents clients from manipulating prices through modified API requests.

## Inventory Transactions

Order creation and cancellation use MongoDB transactions.

For order creation:

```text
Validate customer
      ↓
Validate products
      ↓
Check stock
      ↓
Calculate totals
      ↓
Reduce stock
      ↓
Create order
      ↓
Commit transaction
```

If an error occurs, the transaction is aborted so partial inventory changes are not committed.

Cancellation similarly restores product stock and changes the order status inside a transaction.

## Duplicate SKU Protection

SKU uniqueness is enforced at the MongoDB/Mongoose level using a unique index rather than relying only on frontend validation.

This prevents duplicate SKUs even when requests come directly through the API.

---

# Error Handling

The API returns appropriate HTTP status codes and error messages for common problems such as:

* Invalid request data
* Customer not found
* Product not found
* Insufficient stock
* Duplicate SKU
* Invalid order cancellation
* Already cancelled orders

---

# Demo
no deployment is available, the application can be run locally using the instructions above.

---

# Testing Notes

The automated tests use the dedicated MongoDB test database.

Do not use the production/development database for running tests because the test setup clears test collections.

---

# Author

AppMixo was developed as a full-stack MERN portfolio project demonstrating:

* React development
* REST API development
* MongoDB/Mongoose
* CRUD operations
* Business logic
* Inventory management
* Transactions
* Validation
* Automated backend testing
