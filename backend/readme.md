# Wishlist Server

A Node.js backend API for managing user wishlists and products, built with Express and MongoDB.

## Features

- User authentication (JWT-based)
- Create and manage multiple wishlists
- Add, update, and remove products in wishlists
- Secure API endpoints (protected routes)

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [MongoDB](https://www.mongodb.com/) database (local or cloud)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd wishlist-server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=3000
   ```

## Usage

- Start the server in development mode:
  ```bash
  npm run dev
  ```
- Or start normally:
  ```bash
  npm start
  ```
- The API will be available at `http://localhost:3000/` (or your specified port).

## API Documentation

### Authentication

- `POST /api/auth/signup` — Register a new user
- `POST /api/auth/login` — Login and receive a JWT token

### Wishlist

- `GET /api/wishlist` — Get all wishlists for the authenticated user
- `POST /api/wishlist/create` — Create a new wishlist
- `POST /api/wishlist/:wishlistId/products` — Add a product to a wishlist
- `DELETE /api/wishlist/:wishlistId/products/:productId` — Remove a product from a wishlist
- `PATCH /api/wishlist/:wishlistId/products/:productId` — Update a product in a wishlist

**Note:** All wishlist endpoints require an `Authorization` header:

```
Authorization: Bearer <jwt_token>
```

#### Product Object Example

```json
{
  "name": "Product Name",
  "imageUrl": "https://example.com/image.jpg",
  "price": 100
}
```

## Author

Mohammed Sadique
