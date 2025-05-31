# Flight Booking App (MERN Stack)

A responsive, full-stack flight booking platform inspired by Booking.com, tailored for the Indian market. Users can search, view, and book flights with real-time seat selection and receive instant booking confirmation. All prices are displayed in Indian Rupees (₹) with proper Indian number formatting.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Screens & User Journey](#screens--user-journey)
- [Getting Started](#getting-started)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Overview

**Flight Booking App** is a modern web application where users can:
- Search for flights by origin, destination, date, and passenger count
- View available flights with airline, time, price (₹), and duration
- Book flights with seat selection and passenger details
- Receive a booking reference and summary on confirmation

---

## Features

- User Registration & Login (JWT Authentication)
- Homepage flight search (origin, destination, date, passengers)
- Search results with airline, time, price (₹), duration, "Book Now" CTA
- Booking form: flight summary, user info (name, age, passport), seat selection
- Confirmation screen: booking reference, flight & passenger summary
- Admin panel (optional): manage flights and bookings
- Responsive design (desktop, tablet, mobile)
- Secure payments (integration-ready)
- Clean, accessible UI (CSS Grid/Flexbox)
- Real-time updates for seat availability (optional)

---

## Tech Stack

- **Frontend:** React.js, CSS (Grid/Flexbox), Bootstrap/Material-UI (optional)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Atlas recommended)
- **Authentication:** JWT (JSON Web Tokens)
- **Payment Integration:** Stripe/PayPal (optional)
- **Real-time:** WebSockets/SSE (optional)
- **Deployment:** Vercel/Netlify (Frontend), Render/Heroku (Backend), MongoDB Atlas (DB)

---

## Screens & User Journey

1. **Homepage:** Flight search form (origin, destination, date, passengers)
2. **Search Results:** List of flights with airline, time, price (₹), duration, "Book Now"
3. **Booking Form:** Flight summary, user info, seat selection
4. **Confirmation:** Booking reference, flight & passenger summary
5. **Admin (optional):** Manage flights, view bookings

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- [Optional] Stripe/PayPal account for payments

### Installation

1. **Clone the repository**
    ```
    git clone https://github.com/NishantM11/flight-booking.git
    cd flight-booking
    ```

2. **Install dependencies**
    - Frontend:
        ```
        cd client
        npm install
        ```
    - Backend:
        ```
        cd ../server
        npm install
        ```

3. **Set up environment variables**
    - Create `.env` files in both `client` and `server` folders (see `.env.example` for required variables).

4. **Run the app**
    - Backend:
        ```
        npm run dev
        ```
    - Frontend (in a new terminal):
        ```
        npm start
        ```

5. **Access the app**
    - Frontend: [http://localhost:3000](http://localhost:3000)
    - Backend API: [http://localhost:5000](http://localhost:5000)

---

<pre> ``` flight-booking-app/ ├── frontend/ # React frontend │ ├── src/ │ └── public/ ├── backend/ # Node.js/Express backend │ ├── controllers/ │ ├── models/ │ ├── routes/ │ └── utils/ ├── README.md └── .env.example ``` </pre>
