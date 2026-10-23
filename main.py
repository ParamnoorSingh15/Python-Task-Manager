from fastapi import FastAPI

app = FastAPI(
    title="Python Task Manager API",
    description="A simple REST API for managing tasks",
    version="1.0.0",
)


@app.get("/")
def home():
    return {"message": "Welcome to the Task Manager API"}