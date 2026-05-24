<img width="1909" height="885" alt="Veg4you-Home" src="https://github.com/user-attachments/assets/18eb9243-9c32-4d59-b2ce-f255aa30e439" />

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
| ![Home](<img width="1909" height="885" alt="Veg4you-Home" src="https://github.com/user-attachments/assets/d05f2391-35f1-4819-bf7f-5fd3e1250d4c" />) | ![Products]( <img width="1888" height="897" alt="veg4you-cart" src="https://github.com/user-attachments/assets/eb6bba4f-9d63-44a7-b9aa-4e8d979e890a" />
) | ![Admin]( <img width="1905" height="768" alt="veg4you-admin" src="https://github.com/user-attachments/assets/656a3231-5d8b-4673-8834-0cfbfd331cca" />
) |

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
