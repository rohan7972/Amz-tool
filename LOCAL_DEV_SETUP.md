# 🛠️ Local Development Setup Guide (No Docker)

Since we are moving away from Docker to speed up development cycles, follow this guide to set up your local **PERN** (Postgres, Express, React, Node) environment.

## 1. Prerequisites

You need to have the following installed on your Windows machine:
1.  **Node.js**: (You already have v22.14.0 ✅)
2.  **PostgreSQL**: You currently **do not** have `psql` in your path.
    *   📥 **Download**: [PostgreSQL for Windows](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)
    *   **Install**: Run the installer.
        *   **Password**: Remember the password you set (default usually `postgres` or `admin`).
        *   **Port**: Keep default `5432`.
        *   **Tools**: Ensure "Command Line Tools" are selected.

## 2. Database Setup

Once Postgres is installed:
1.  Open **pgAdmin** (installed with Postgres) or a terminal.
2.  Create a new database named `amazon_fdc_tool`.
    *   Command line equivalent: `createdb -U postgres amazon_fdc_tool`

## 3. Environment Configuration

I have created template files for you. Run these steps to activate them:

### Backend
1.  Go to `backend/` folder.
2.  Rename `env.dev` to `.env`.
3.  Edit `.env` if your Postgres password is not `postgres`.

### Frontend
1.  Go to `frontend/` folder.
2.  Rename `env.dev` to `.env`.

## 4. Initialization

Open a new terminal in the project root:

```powershell
# 1. Install all dependencies (if not done)
npm run install:all

# 2. Run Database Migrations (Backend MUST have .env configured first)
cd backend
npm run migrate
```

## 5. Running the App

You can now run the app in "Hot Reload" mode.

**Option A: Run Everything (One Terminal)**
```powershell
# From project root
npm run dev
```

**Option B: Separate Terminals (Better logs)**
*   **Terminal 1 (Backend)**:
    ```powershell
    cd backend
    npm run dev
    ```
*   **Terminal 2 (Frontend)**:
    ```powershell
    cd frontend
    npm run dev
    ```

## 6. Verification
*   **Frontend**: http://localhost:5173
*   **Backend**: http://localhost:3001
