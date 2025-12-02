# Price Drop Alert App

This project is a full-stack application with a React frontend and an Express backend.

## Structure

- `client/`: Frontend application (Vite + React)
- `server/`: Backend API (Node.js + Express)

## Getting Started

### Prerequisites

- Node.js installed

### Setup

1.  **Install dependencies:**

    ```bash
    cd client && npm install
    cd ../server && npm install
    ```

2.  **Run locally:**

    -   **Frontend:**
        ```bash
        cd client
        npm run dev
        ```
    -   **Backend:**
        ```bash
        cd server
        npm run dev
        ```

## Deployment

### Frontend (Vercel)

1.  Push this repository to GitHub.
2.  Import the project in Vercel.
3.  Set the **Root Directory** to `client`.
4.  The `vercel.json` in `client` handles routing.

### Backend (Railway)

1.  Push this repository to GitHub.
2.  Create a new project in Railway from the GitHub repo.
3.  Set the **Root Directory** to `server`.
4.  Railway will automatically detect `npm start` and run the server.
