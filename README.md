# Aenzbi HotelResto - AI-Powered Hospitality Management

Aenzbi HotelResto is a modern, proof-of-concept application demonstrating a comprehensive hotel property management system (PMS) and restaurant point-of-sale (POS) system. It is enhanced with powerful AI features, leveraging the Google Gemini API for intelligent data analysis and content generation.

## ✨ Features

-   **Dashboard Overview**: At-a-glance view of key metrics like total revenue, hotel occupancy rates, restaurant orders, and room availability, complete with interactive charts.
-   **Restaurant POS**: An intuitive interface for taking customer orders. Browse menu items by category, add them to a dynamic order summary, adjust quantities, and see a real-time calculation of the subtotal, tax, and total.
-   **Hotel PMS**: A visual grid of all hotel rooms, color-coded by status (Available, Occupied, Dirty, Maintenance). Users can click on a room to manage its state, including checking guests in/out, booking available rooms, and updating cleaning status.
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
│   ├── RestaurantPOS.tsx   # Restaurant point-of-sale interface
│   └── Sidebar.tsx         # Main navigation sidebar
└── services/
    ├── geminiService.ts    # Functions for interacting with the Gemini API
    └── mockData.ts         # Mock data for rooms, menu items, and sales
```

## 📄 License

This project is a demonstration and is not licensed for production use.
