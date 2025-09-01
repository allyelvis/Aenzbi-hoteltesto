
# Aenzbi HotelResto - AI-Powered Hospitality Management

Aenzbi HotelResto is a modern, proof-of-concept application demonstrating a comprehensive hotel property management system (PMS) and restaurant point-of-sale (POS) system. It is enhanced with powerful AI features, leveraging the Google Gemini API for intelligent data analysis and content generation.

## ✨ Features

-   **Dashboard Overview**: At-a-glance view of key metrics like total revenue, hotel occupancy rates, restaurant orders, and room availability, complete with interactive charts.
-   **Advanced Restaurant POS**: An intuitive, feature-rich interface for managing restaurant operations.
    -   Interactive floor plan for table selection and status management.
    -   Full menu browsing with search and category filters.
    -   CRUD operations for menu items, including AI-powered description generation.
    -   Dynamic order summary with real-time calculations.
    -   Configurable tax management system (percentage and fixed-rate).
    -   Integrated payment processing modal with simulated gateway transactions for cash, card, and mobile payments.
-   **Comprehensive Hotel PMS**: A multi-faceted system for complete hotel management.
    -   **Visual Room Grid**: An overview of all rooms, color-coded by real-time status (Available, Occupied, Dirty, Maintenance).
    -   **Advanced Booking Management**: A powerful modal for creating new bookings, checking guests in/out, processing payments, and viewing reservation details.
    -   **Housekeeping Module**: A dedicated, table-based view for housekeeping staff to efficiently track and update room cleaning statuses (Clean, Dirty, In Progress).
    -   **Guest CRM**: A central location to manage guest information and view their complete booking history.
    -   **Reporting & Analytics**: Visual charts for key hotel metrics, including a 7-day occupancy forecast and revenue breakdown by room type.
    -   **Invoice & Fiscalization**: Generate detailed invoices for any booking and simulate printing to a fiscal printer.
-   **Inventory Management**: A complete solution for tracking stock, suppliers, and purchase orders.
-   **AI-Powered Tools**:
    -   **Menu Description Generator**: Select a menu item and let Gemini generate a short, creative, and enticing description for it.
    -   **AI Sales Analyst**: Ask natural language questions about your sales data (e.g., "What was our best-selling item?") and receive instant, insightful analysis from Gemini.

## 🛠️ Tech Stack

-   **Frontend**: React, TypeScript, Tailwind CSS
-   **AI Integration**: Google Gemini API (`@google/genai`)
-   **Routing**: React Router (`react-router-dom`)
-   **Data Visualization**: Recharts
-   **Build/Dev Environment**: Vite (implied by file structure)

## 🚀 Getting Started

### Prerequisites

-   A modern web browser.
-   A valid API key for the Google Gemini API.

### Installation & Running

1.  **Environment Variables**: This application requires a Google Gemini API key to be configured. The key must be available as an environment variable named `API_KEY`.

    ```
    # In your environment setup (e.g., .env file, or system variables)
    API_KEY="YOUR_GEMINI_API_KEY_HERE"
    ```
    *The application code in `services/geminiService.ts` is already set up to read this variable.*

2.  **Running the App**: Open the `index.html` file in your browser, or serve the project directory using a local web server. The application is designed to work out-of-the-box in an environment where the dependencies are managed via an import map.

## 📂 Project Structure

```
.
├── index.html              # Main HTML entry point, includes CDN links and import map
├── index.tsx               # React application root
├── App.tsx                 # Main app component, handles routing and layout
├── metadata.json           # Application metadata
├── constants.tsx           # SVG icons and constant values
├── types.ts                # TypeScript interfaces and enums for data models
├── components/
│   ├── AiTools.tsx         # Component for AI-powered features
│   ├── Dashboard.tsx       # Main dashboard component with charts and stats
│   ├── Header.tsx          # Top header bar component
│   ├── HotelPMS.tsx        # Hotel room management grid component
│   ├── Inventory.tsx       # Inventory management component
│   ├── RestaurantPOS.tsx   # Restaurant point-of-sale interface
│   └── Sidebar.tsx         # Main navigation sidebar
└── services/
    ├── geminiService.ts    # Functions for interacting with the Gemini API
    └── mockData.ts         # Mock data for rooms, menu items, and sales
```

## 📄 License

This project is a demonstration and is not licensed for production use.
