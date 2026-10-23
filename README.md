# Python Task Manager

A simple task management application built using **FastAPI** for the backend and **React (Vite)** for the frontend.

## Features

- Create tasks
- View all tasks
- Update tasks
- Delete tasks
- Health check API
- React-based user interface

## Requirements

- Python
- Node.js and npm

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

Open a **second terminal** and run:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL shown in the terminal, usually:

http://localhost:5173

Keep both the backend and frontend terminals running while using the application.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Check API health |
| POST | `/tasks` | Create a task |
| GET | `/tasks` | Retrieve all tasks |
| PUT | `/tasks/{task_id}` | Update a task |
| DELETE | `/tasks/{task_id}` | Delete a task |

## Technologies Used

- Python
- FastAPI
- React
- Vite
- JavaScript
- Docker


