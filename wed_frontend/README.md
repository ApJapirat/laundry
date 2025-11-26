Laundry Admin – TypeWash Theme

A modern and responsive admin dashboard for managing laundry shop operations.
Built with React + Vite and styled using a custom TypeWash.

🚀 Tech Stack
    -React + Vite
    -React Router
    -Recharts (bar, line, pie charts)
    -Custom CSS Theme (typewash-theme.css)
    -Axios / Fetch API

📌 Features
    Dashboard
        -Total orders
        -Revenue overview
        -Status distribution charts
        -7-day revenue line graph
        -Pending orders & today's pickup list
    Customers
        -Add new customer
        -View customer list
    Orders
        -Create new order
        -Manage order details
        -Update laundry status (pending → washing → drying → ironing → ready → picked_up)
        -View dropoff & pickup-due timestamps

🛠️ Project Setup
    Install dependencies
        npm install
    Run development server
        npm run dev
    The app will be available at:
        http://localhost:5173

🎨 Theme
    This project uses a fully custom CSS theme:
        src/typewash-theme.css
    Inspired by Monkeytype, using:
        -dark gradients
        -orange accent
        -soft shadows 
        -rounded surfaces
        -high-contrast charts
    Easy to modify through centralized CSS variables.

📂 Folder Structure
    src/
        pages/
        layout/
        services/
        assets/
        typewash-theme.css
        App.jsx
        main.jsx

✔️ Status
    -Works fully with mock API
    -Frontend ready to integrate with real backend
    -Clean, modern UI designed for real shop usage