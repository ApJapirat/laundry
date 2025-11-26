# Laundry Management System 🧺✨
A full-stack laundry admin system built with **FastAPI (Backend)** and **React + Vite (Frontend)**.  
Designed for easy order tracking, customer management, and real-time dashboard visualization.

---

## 👥 Team Members
| Name | Role | Responsibility |
|------|------|----------------|
| **ApJapirat** | Frontend Developer | UI design, dashboard charts, theming system, page layout |
| **BigBug273** | Backend Developer | API creation, database models, CRUD logic |

---

## 📦 Project Structure

```
laundry/
├── wed_api copy/
│   ├── crud.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   └── requirements.txt
│
├── wed_backend/
│   ├── crud.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── frontend.html
│   └── requirements.txt
│
├── wed_frontend/
│   ├── public/
│   │   └── laundry_logo.svg
│   │
│   ├── src/
│   │   ├── assets/
│   │   │   └── react.svg
│   │   │
│   │   ├── layout/
│   │   │   └── DashboardLayout.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── AddCustomerPage.jsx
│   │   │   ├── AddOrderPage.jsx
│   │   │   ├── CustomersPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── OrderDetailsPage.jsx
│   │   │   └── OrdersPage.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   └── typewash-theme.css
│   │
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```
---

# 🚀 Features

## 🌐 **Frontend (React + Vite)**
### Dashboard
- Total orders  
- Total revenue & today revenue  
- Status summary  
- Bar chart: orders by status  
- Pie chart: status distribution  
- Line chart: 7-day revenue  
- Pending orders list  
- Pickup due today  

### Customers
- Add customer  
- List all customers  

### Orders
- Create order  
- View order details  
- Update status  
- View drop-off & pickup times  

### Extra
- Global custom theme (**typewash-theme.css**)  
- Monkeytype-inspired sidebar buttons  
- Radial-gradient background  
- Smooth transitions, shadows, and UI polish  

---

## 🔧 Backend (FastAPI)
### Included:
- **Database models**  
- **CRUD operations**  
- **Schemas for validation**  
- **FastAPI server**  
- Fully functional endpoints:
  - `/customers`
  - `/orders`
  - `/orders/{id}`
  - `/status`
  - `/summary/dashboard`

### Technologies:
- FastAPI  
- SQLAlchemy  
- Pydantic  
- SQLite (or your DB)  

---

# 🛠️ Installation

## Backend

''' bash
cd wed_backend
pip install -r requirements.txt
uvicorn main:app --reload
'''

## Backend will run at:
    http://localhost:8000

## Frontend
    cd wed_frontend
    npm install
    npm run dev


## Frontend will run at:
    http://localhost:5173

# 🎨 Custom Theme  
All UI colors & design rules are inside:  
    src/typewash-theme.css  
You can change the mood of the whole website by editing only the :root variable block.

# 🚀 Future Upgrades (Optional)
- User authentication (login)  
- Admin roles  
- Order filtering & search  
- Monthly revenue statistics  
- Export data as Excel/PDF  

# 💖 Special Thanks  
This project is a collaboration focused on learning:  
- Frontend UI/UX design  
- React component architecture  
- Backend CRUD system  
- API integration  
- Styling with CSS variables and reusable themes  

Thanks to both developers for creating a clean, modern and complete laundry management system.


