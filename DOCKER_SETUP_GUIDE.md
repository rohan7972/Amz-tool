# Docker Setup Guide & Explanation

## Why do we need Docker?
Docker is not strictly "needed" to run an application, but it solves several critical problems in software development and deployment. We use it here to ensure the application runs exactly the same on your machine as it does on mine or in production.

### Core Benefits
1.  **Consistency**: "It works on my machine" is a common problem. Docker packages the OS, libraries, and code together, guaranteeing consistency.
2.  **Isolation**: The database (Postgres) and cache (Redis) run in their own containers. They won't interfere with other databases you might have installed on your system.
3.  **Simplified Setup**: Instead of installing Node.js, PostgreSQL, Redis, and manually configuring environment variables, you run one command, and Docker sets it all up.
4.  **Version Control**: We specify exact versions of Node, Postgres, and Redis in the implementation. You don't need to worry about having the "wrong version" installed locally.

## What can we use instead of Docker?
If you prefer not to use Docker, you can run the application "bare metal" or locally on your machine. This is often called a "Manual Setup".

### Alternative: Manual Setup
To run this application without Docker, you would need to:
1.  **Install Node.js 18+**: Manually download and install.
2.  **Install PostgreSQL**: Download, install, configure a user/password, and create a database named `amazon_fdc_tool`.
3.  **Install Redis**: Download and run a Redis server.
4.  **Configure Environment**: Create `.env` files in both `frontend` and `backend` directories with the correct connection strings pointing to your local services.
5.  **Run Services**: Open two terminal windows.
    *   Backend: `cd backend && npm install && npm run dev`
    *   Frontend: `cd frontend && npm install && npm run dev`

**Verdict**: Docker automates all of the above steps into a single command.

---

## How to Run with Docker (Recommended)

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

### 1. Build and Run
Open your terminal in the project root and run:

```bash
docker-compose up --build
```

This command will:
1.  Build the images for the frontend and backend using the new `Dockerfile.dev` files.
2.  Pull the Postgres and Redis images.
3.  Start all services (Frontend, Backend, Postgres, Redis, Adminer) and network them together.

### 2. Access the Application
- **Frontend (App)**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **Database Admin (Adminer)**: [http://localhost:8080](http://localhost:8080) (System: PostgreSQL, Server: postgres, User: postgres, Password: password, Database: amazon_fdc_tool)

### 3. Stopping the Application
Press `Ctrl+C` in the terminal, or run:
```bash
docker-compose down
```
To remove volumes (fresh database start): `docker-compose down -v`
