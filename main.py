
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, Field

app = FastAPI(
    title="Python Task Manager API",
    description="A simple REST API for managing tasks",
    version="1.0.0",
)

# Temporary in-memory storage
tasks = []
next_task_id = 1


# Model for creating and validating tasks
class TaskCreate(BaseModel):
    title: str = Field(
        min_length=1,
        max_length=100,
    )
    description: str = Field(
        default="",
        max_length=500,
    )
    completed: bool = False


# Homepage
@app.get("/")
def home():
    return {"message": "Welcome to the Task Manager API"}


# Health-check endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy"}


# Create a new task
@app.post("/tasks", status_code=status.HTTP_201_CREATED)
def create_task(task: TaskCreate):
    global next_task_id

    # Reject titles containing only spaces
    if not task.title.strip():
        raise HTTPException(
            status_code=422,
            detail="Task title cannot be empty or contain only spaces",
        )

    new_task = {
        "id": next_task_id,
        "title": task.title.strip(),
        "description": task.description,
        "completed": task.completed,
    }

    tasks.append(new_task)
    next_task_id += 1

    return new_task


# Retrieve all tasks
@app.get("/tasks")
def get_tasks():
    return tasks
