# 🥦 Veg4You - Online Vegetable Delivery Web App

A full-stack responsive web application for vegetable delivery with User & Admin panels, JWT authentication, live order management, and delivery charges based on location.

## 🚀 Tech Stack

- **Frontend:** React, Redux Toolkit, React Router v6, Tailwind CSS / Bootstrap 5  
- **Backend:** Node.js, Express.js, MongoDB, JWT  
- **Authentication:** JWT (Login/Register with Referral System)  
- **State Management:** Redux Toolkit  
- **Styling:** Tailwind CSS or Bootstrap 5  

---

## 📸 Screenshots

| Home Page | Product Page | Admin Dashboard |
|-----------|--------------|-----------------|
| ![Home](./screenshots/home.png) | ![Products](./screenshots/products.png) | ![Admin](./screenshots/admin.png) |

---

## 🧑‍💼 Features

### 👤 User Panel
- Register/Login with Referral Code
- Browse products with images & per kg pricing
- Add to cart with quantity (kg)
- Checkout with address and delivery charge based on colony
- Track past orders and statuses

### 🛠 Admin Panel
- Secure Admin Login
- Create / Edit / Delete Products
- Manage all Users and their referral points
- View and update Orders with live status change
- Track New Users joined today

---

## 🎯 Key Functionalities

- 💳 JWT-based Authentication with role-based access  
- 🎁 Referral system with automatic points update  
- 📦 Cart system supporting per kg logic  
- 🚚 Dynamic delivery charge based on user's colony  
- 📊 Admin Dashboard with user/order/product stats  
- 💬 WhatsApp floating icon for customer support  

---

## 🛠 Project Structure
Veg4You/
├── backend/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ └── server.js
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── features/ (Redux Slices)
│ │ ├── pages/
│ │ ├── App.jsx
│ │ └── main.jsx
