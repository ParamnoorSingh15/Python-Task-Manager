
# Python Task Manager

A simple task management application built using **FastAPI** for the backend and **React (Vite)** for the frontend.

## Features

- Create tasks
- View all tasks
- Update tasks
- Delete tasks
- Health check API
- React-based user interface
- Dockerized application with a production frontend build

## Requirements

- Python 3.12+
- Node.js and npm
- Docker

## Run the Backend

Open a terminal in the project root directory:

```bash
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

Backend: http://127.0.0.1:8000

API documentation: http://127.0.0.1:8000/docs

Health check: http://127.0.0.1:8000/health

## Run the React UI

Open a second terminal and run:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL shown in the terminal, usually:

http://localhost:5173

Keep both terminals running while using the application.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Check API health |
| POST | `/tasks` | Create a task |
| GET | `/tasks` | Retrieve all tasks |
| PUT | `/tasks/{task_id}` | Update a task |
| DELETE | `/tasks/{task_id}` | Delete a task |

## Run with Docker

The Dockerfile builds the React frontend and runs it with the FastAPI backend in a single container.

### 1. Build the Docker Image

Run this command from the project root directory, where the Dockerfile is located:

```bash
docker build -t python-task-manager .
```

### 2. Run the Container

```bash
docker run -d --name task-manager -p 8000:8000 python-task-manager
```

### 3. Access the Application

- Application: http://localhost:8000
- API documentation: http://localhost:8000/docs
- Health check: http://localhost:8000/health

### 4. Verify the Container

Check running containers:

```bash
docker ps
```

View application logs:

```bash
docker logs task-manager
```

### 5. Stop and Remove the Container

```bash
docker stop task-manager
docker rm task-manager
```

### 6. Rebuild After Code Changes

```bash
docker rm -f task-manager
docker build -t python-task-manager .
docker run -d --name task-manager -p 8000:8000 python-task-manager
```

## Technologies Used

- Python
- FastAPI
- React
- Vite
- JavaScript
- Docker
- Git
- GitHub
- GitLab
