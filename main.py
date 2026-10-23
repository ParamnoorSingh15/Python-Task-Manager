
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


# Update an existing task
@app.put("/tasks/{task_id}")
def update_task(task_id: int, updated_task: TaskCreate):
    if not updated_task.title.strip():
        raise HTTPException(
            status_code=422,
            detail="Task title cannot be empty or contain only spaces",
        )

    for task in tasks:
        if task["id"] == task_id:
            task["title"] = updated_task.title.strip()
            task["description"] = updated_task.description
            task["completed"] = updated_task.completed

            return task

    raise HTTPException(
        status_code=404,
        detail="Task not found",
    )


# Delete an existing task
@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    for index, task in enumerate(tasks):
        if task["id"] == task_id:
            deleted_task = tasks.pop(index)

            return {
                "message": "Task deleted successfully",
                "task": deleted_task,
            }

    raise HTTPException(
        status_code=404,
        detail="Task not found",
    )


