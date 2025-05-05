# 🛍️ Shared Wishlist App

A full-stack collaborative shopping wishlist platform built for the FlockShop.ai Full Stack Intern Assignment.

**🌐 Live Demo:** [wishlist-frontend-neon.vercel.app](https://wishlist-frontend-neon.vercel.app/)

---

## 🚀 Overview

The Shared Wishlist App empowers groups of friends, family, or colleagues to create, manage, and contribute to shared shopping wishlists. It’s perfect for collective gift planning, event organizing, or any group shopping activity.

---

## 🗂️ Project Structure

```
flock-assignment/
│
├── frontend/      # React + Vite app (user interface)
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── ...        
│
├── backend/       # Node.js + Express + MongoDB API server
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── server.js
│   ├── package.json
│   └── ...
│
└── README.md      # (you are here)
```

### Folder Highlights

- **frontend/**: All React code, components, pages, styling (Tailwind), and state management (Redux).
- **backend/**: Express server, API endpoints, MongoDB/Mongoose models, authentication, and business logic.

---

## 🛠️ Tech Stack

- **Frontend:** React, Vite, Redux Toolkit, Tailwind CSS, Shadcn
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT (auth)
- **Other:** React Router, React Hook Form, modern ES modules, Vercel+Render (deployment)

---

## ✨ Features

- **Authentication:** Signup/Login (mocked; easily upgradable)
- **Wishlist Management:** Create, edit, delete wishlists
- **Product Management:** Add, edit, remove products (with name, image, price)
- **User Tracking:** See who contributed or updated each product
- **Invitations:** Invite users to a wishlist (UI only, logic mocked)
- **(Bonus) Real-time:** (If implemented) Instant updates or reactions/comments
- **Responsive UI:** Works on all devices

---

## ⚡ Quick Start

### 1. Clone the Repo

```bash
git clone https://github.com/sadique-mohammed/flock-assignment.git
cd flock-assignment
```

### 2. Backend Setup

```bash
cd backend
npm install
# Copy .env.example to .env and update as needed:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/wishlist
# JWT_SECRET=your_secret
npm run dev
```
- The backend API will start on `http://localhost:5000` and it is deployed on render `https://flockshop-shared-wishlist-backend.onrender.com/`

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```
- The frontend will run on `http://localhost:5173` (or as shown in terminal)

### 4. Production (Deployed)

- Visit the **live demo**: [wishlist-frontend-neon.vercel.app](https://wishlist-frontend-neon.vercel.app/)

---


## 📦 API Overview

The backend exposes a RESTful API for all wishlist, user, and product operations.  
(See `/backend/routes/` and `/backend/controllers/` for details and add API docs if needed.)

---

## 🚀 Future Improvements

- Upgrade authentication to OAuth or Firebase Auth
- Enable real invite links and email notifications
- Add real-time collaboration (WebSockets/Firebase)
- Comments, reactions, and notifications
- Docker support & cloud deployment (MongoDB Atlas, Vercel, Render, etc.)
- Improved accessibility, more tests, and CI/CD

---

## 👤 Author

**Mohammed Sadique**

---
