# 🚗 ViaPool — Real-Time Carpooling Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-forest.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20-green.svg)](https://nodejs.org/)
[![PWA](https://img.shields.io/badge/PWA-Ready-orange.svg)](https://web.dev/progressive-web-apps/)

**ViaPool** is a premium, full-stack carpooling platform designed to bridge the gap between drivers and passengers. Built with a focus on real-time interaction, data security, and high-end user experience, it offers a seamless way to share rides, split costs, and reduce the carbon footprint.

---

## ✨ Features

### 👤 For Passengers
*   **Dynamic Ride Discovery:** Intelligent search with **Geo-Spatial Querying** (`2dsphere`) to find the best ride matches based on proximity.
*   **Live Tracking:** Real-time visibility of the driver's location and route geometry using **Socket.IO** and **Leaflet**.
*   **Ride Preferences:** Filter rides based on preferences such as *Gender Preference* and *Pet-Friendly* options.
*   **In-App Communication:** Seamless low-latency chat for ride coordination.
*   **Secure Payments:** Integrated **Razorpay** checkout for verified and safe transactions.
*   **SOS Safety:** One-tap emergency alert system sending live coordinates via **Nodemailer** to admins and emergency contacts.

### 🚘 For Drivers
*   **Comprehensive Onboarding:** Professional verification process for identity and vehicle management.
*   **Vehicle Fleet Management:** Support for adding and managing multiple vehicles with "Primary Vehicle" selection.
*   **Ride Life-Cycle Management:** Full control over ride states (Scheduled → Ongoing → Completed).
*   **Earnings Analytics:** Real-time financial overview with detailed breakdowns of completed earnings.
*   **Live Navigation:** Route visualization and distance/duration calculation powered by **OSRM**.

### ⭐ Reputation & Trust
*   **Peer Review System:** Two-way rating and review system for both passengers and drivers to build platform trust.
*   **User Profiles:** Detailed user profiles featuring bio, ratings, and verified status.

---

## 🛠️ Technical Stack

### **Frontend**
*   **Framework:** React 19 (Vite)
*   **Styling:** Tailwind CSS 4 & Vanilla CSS
*   **Motion:** Framer Motion for premium micro-animations
*   **Maps:** Leaflet.js with custom **OSRM & Nominatim** (OpenStreetMap) integration
*   **State:** React Hooks & Context API

### **Backend**
*   **Runtime:** Node.js (Express 5)
*   **Database:** MongoDB with Mongoose (Geo-spatial indexing)
*   **Real-time:** Socket.IO for duplex location updates and messaging
*   **Authentication:** JWT with **Refresh Token** strategies and HTTP-only cookies
*   **Storage:** AWS S3 with **Multer** for secure document and profile photo management
*   **Integrations:** Razorpay (Payments), Nodemailer (Emails), Nominatim (Geocoding)

---

## 🔒 Security & Optimization

*   **Standardized API Architecture:** Implemented custom `ApiResponse`, `ApiError`, and `asyncHandler` wrappers for consistent error handling and response formatting.
*   **Payment Integrity:** Signature verification using **HMAC-SHA256** and **timing-safe comparisons** (`crypto.timingSafeEqual`).
*   **Cost-Efficient Mapping:** Utilizes open-source mapping services (OSRM/Nominatim) to minimize reliance on high-cost proprietary APIs.
*   **PWA Ready:** Optimized Service Workers with specialized caching strategies (NetworkFirst/StaleWhileRevalidate) for a native-like experience.

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+)
*   MongoDB Atlas account
*   Razorpay API Keys
*   AWS S3 Credentials

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/pramodhpillitla/viapool.git
    cd viapool
    ```

2.  **Backend Setup**
    ```bash
    cd Backend
    npm install
    cp .env.example .env
    # Fill in your environment variables
    npm run dev
    ```

3.  **Frontend Setup**
    ```bash
    cd ../frontend
    npm install
    npm run dev
    ```

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Built with ❤️ by the ViaPool Team.*
