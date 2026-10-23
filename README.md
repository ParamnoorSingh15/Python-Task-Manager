# 📝 Python Task Manager

A full-stack task management application built with a **FastAPI** backend and a **React + Vite** frontend. Manage your to-do list through a clean, responsive UI backed by a RESTful API — runnable locally or as a single Docker container.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Getting Started (Local Development)](#-getting-started-local-development)
  - [Prerequisites](#prerequisites)
  - [1. Backend Setup](#1-backend-setup)
  - [2. Frontend Setup](#2-frontend-setup)
- [Docker](#-docker)
  - [Build the Image](#build-the-image)
  - [Run the Container](#run-the-container)
  - [Useful Docker Commands](#useful-docker-commands)
- [How It Works](#-how-it-works)
- [Limitations](#-limitations)

---

## ✨ Features

- ✅ **Create** tasks with a title and optional description
- 📝 **Edit** existing tasks inline
- 🗑️ **Delete** tasks with a confirmation prompt
- ☑️ **Toggle completion** status with a single click
- 📊 Live **pending task counter** in the header
- ⚠️ Input **validation** (empty/whitespace-only titles rejected on both client and server)
- 🔌 **Health check** endpoint for container orchestration
- 📖 Auto-generated **Swagger UI** at `/docs`
- 🐳 **Single-container Docker** deployment (React build served by FastAPI)

---

## 🛠 Tech Stack

| Layer     | Technology                        | Version   |
|-----------|-----------------------------------|-----------|
| Backend   | FastAPI                           | 0.161.1   |
| Server    | Uvicorn (ASGI)                    | 0.54.0    |
| Validation| Pydantic                          | 2.14.1    |
| Frontend  | React                             | 19.3.1    |
| Bundler   | Vite                              | 8.3.4     |
| Icons     | Lucide React                      | 1.61.0    |
| Container | Docker (multi-stage build)        | —         |

---

## 📁 Project Structure

```
Python Task Manager/
├── main.py               # FastAPI application — all API routes
├── requirements.txt      # Python dependencies
├── dockerfile            # Multi-stage Docker build
├── .gitignore
│
└── frontend/             # React + Vite SPA
    ├── index.html
    ├── vite.config.js    # Dev proxy config (routes /tasks → FastAPI)
    ├── package.json
    └── src/
        ├── App.jsx       # Main React component (all UI logic)
        └── App.css       # Application styles
```

---

## 📡 API Reference

The base URL in local development is `http://127.0.0.1:8000`.  
Interactive docs are available at **`http://127.0.0.1:8000/docs`** (Swagger UI).

### Task Object

```json
{
  "id": 1,
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false
}
```

### Endpoints

| Method   | Path               | Description              | Status Codes         |
|----------|--------------------|--------------------------|----------------------|
| `GET`    | `/`                | Welcome message          | `200`                |
| `GET`    | `/health`          | Health check             | `200`                |
| `GET`    | `/tasks`           | List all tasks           | `200`                |
| `POST`   | `/tasks`           | Create a new task        | `201`, `422`         |
| `PUT`    | `/tasks/{task_id}` | Update an existing task  | `200`, `404`, `422`  |
| `DELETE` | `/tasks/{task_id}` | Delete a task            | `200`, `404`         |

### Request Body — `POST /tasks` and `PUT /tasks/{task_id}`

| Field         | Type    | Required | Constraints              |
|---------------|---------|----------|--------------------------|
| `title`       | string  | ✅ Yes   | 1–100 chars, non-blank   |
| `description` | string  | ❌ No    | Max 500 chars            |
| `completed`   | boolean | ❌ No    | Default: `false`         |

#### Example cURL Requests

```bash
# Create a task
curl -X POST http://127.0.0.1:8000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy groceries", "description": "Milk and eggs"}'

# List all tasks
curl http://127.0.0.1:8000/tasks

# Update a task (mark complete)
curl -X PUT http://127.0.0.1:8000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy groceries", "description": "Milk and eggs", "completed": true}'

# Delete a task
curl -X DELETE http://127.0.0.1:8000/tasks/1

# Health check
curl http://127.0.0.1:8000/health
```

#### Example Response — Create Task

```json
{
  "id": 1,
  "title": "Buy groceries",
  "description": "Milk and eggs",
  "completed": false
}
```

---

## 🚀 Getting Started (Local Development)

Running locally starts **two separate processes** — the FastAPI backend and the Vite dev server. Vite proxies all `/tasks` and `/health` calls to FastAPI so the frontend works transparently.

### Prerequisites

- **Python** 3.10+ (3.12 recommended)
- **Node.js** 18+ (22 recommended) and **npm**
- **Git**

### 1. Backend Setup

```bash
# Clone the repository
git clone https://github.com/ParamnoorSingh15/Python-Task-Manager.git
cd "Python Task Manager"

# Create and activate a virtual environment

# Windows (PowerShell)
python -m venv .venv
.venv\Scripts\Activate.ps1

# macOS / Linux
python -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the API server with hot-reload
uvicorn main:app --reload --port 8000
```

The API is now running at **`http://127.0.0.1:8000`**  
Swagger UI: **`http://127.0.0.1:8000/docs`**

### 2. Frontend Setup

Open a **second terminal** in the project root:

```bash
cd frontend

# Install Node dependencies
npm install

# Start the Vite dev server
npm run dev
```

The React app is now running at **`http://localhost:5173`**

> **Note:** Both servers must be running simultaneously during local development. The Vite proxy (configured in `vite.config.js`) forwards `/tasks`, `/health`, `/docs`, and `/openapi.json` requests from the browser to FastAPI on port 8000.

---

## 🐳 Docker

The `dockerfile` uses a **multi-stage build** to produce a single self-contained image:

- **Stage 1 (`frontend-builder`)** — Uses `node:22-alpine` to install npm dependencies and run `vite build`, producing the optimised React bundle in `/build/dist`.
- **Stage 2 (`backend`)** — Uses `python:3.12-slim` to install Python dependencies, copies the FastAPI app and the compiled React build, then starts Uvicorn on port **8000**.

No separate frontend server is needed — Uvicorn/FastAPI serves everything from one port.

### Build the Image

```bash
# From the project root (same directory as the dockerfile)
docker build -t task-manager .
```

> The first build downloads base images and installs all dependencies — this may take a few minutes. Subsequent builds are fast thanks to Docker layer caching.

### Run the Container

```bash
# Foreground (logs visible in terminal)
docker run -p 8000:8000 task-manager

# Background (detached)
docker run -d -p 8000:8000 --name task-manager task-manager
```

Open **`http://localhost:8000`** — the React frontend and API are both served from the same port.

### Useful Docker Commands

```bash
# ── Build ────────────────────────────────────────────────────────────────────

# Standard build
docker build -t task-manager .

# Force a clean build (ignores all cached layers)
docker build --no-cache -t task-manager .

# Tag the image for a registry
docker tag task-manager your-dockerhub-username/task-manager:latest

# Push to Docker Hub
docker push your-dockerhub-username/task-manager:latest


# ── Run & Manage ─────────────────────────────────────────────────────────────

# Run in the foreground (Ctrl+C to stop)
docker run -p 8000:8000 task-manager

# Run detached in the background
docker run -d -p 8000:8000 --name task-manager task-manager

# Run detached and auto-restart on crash or system reboot
docker run -d -p 8000:8000 --restart unless-stopped --name task-manager task-manager

# Stop the container
docker stop task-manager

# Start a stopped container
docker start task-manager

# Restart the container
docker restart task-manager


# ── Inspect & Debug ───────────────────────────────────────────────────────────

# View all logs
docker logs task-manager

# Stream (follow) live logs
docker logs -f task-manager

# Show last 50 log lines
docker logs --tail 50 task-manager

# Open an interactive shell inside the running container
docker exec -it task-manager /bin/sh

# Inspect container metadata (IP, mounts, environment variables, etc.)
docker inspect task-manager

# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# Show real-time resource usage (CPU, memory, network)
docker stats task-manager


# ── Cleanup ───────────────────────────────────────────────────────────────────

# Remove a stopped container
docker rm task-manager

# Force-remove a running container
docker rm -f task-manager

# Remove the image
docker rmi task-manager

# Remove all stopped containers, unused networks, dangling images
docker system prune

# Remove everything unused including images and volumes (use with caution)
docker system prune -a --volumes
```

---

## ⚙️ How It Works

### Local Development Flow

```
Browser (localhost:5173)
        │
        │  /tasks, /health, /docs
        ▼
  Vite Dev Server ──proxy──► FastAPI (localhost:8000)
                                    │
                               tasks[] (in-memory list)
```

### Docker / Production Flow

```
Browser (localhost:8000)
        │
        ├── GET /           → React SPA (index.html from frontend/dist)
        ├── GET /tasks      → FastAPI route handler
        ├── POST /tasks     → FastAPI route handler
        └── ...
        ▼
  Uvicorn + FastAPI (port 8000, single worker)
        │
   tasks[] (in-memory list, lives for the container lifetime)
```

---

## ⚠️ Limitations

| Limitation | Detail |
|---|---|
| **In-memory storage** | All tasks are lost when the server or container restarts. Add a database (e.g. SQLite + SQLAlchemy, or PostgreSQL) for persistence. |
| **Single worker** | The Dockerfile runs Uvicorn with `--workers 1` to prevent data inconsistency across processes sharing the in-memory list. A database removes this constraint. |
| **No authentication** | The API is open — anyone with network access can read and modify tasks. |
| **CORS scope** | In local dev, CORS is restricted to `http://localhost:5173`. In Docker, the frontend and API share the same origin so CORS is not an issue. |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
