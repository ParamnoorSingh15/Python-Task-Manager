# =============================================================================
# Stage 1 - Build the React frontend
# =============================================================================
FROM node:22-alpine AS frontend-builder

WORKDIR /build

# Install dependencies first (cached layer unless package.json changes)
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

# Copy the rest of the frontend source and build
COPY frontend/ ./
RUN npm run build
# Vite outputs the production bundle to /build/dist


# =============================================================================
# Stage 2 - Run the FastAPI backend (and serve the React build from it)
# =============================================================================
FROM python:3.12-slim AS backend

# Set working directory inside the container
WORKDIR /app

# Install Python dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the FastAPI application
COPY main.py tasks.py* ./

# Copy the compiled React app so main.py can find frontend/dist
COPY --from=frontend-builder /build/dist ./frontend/dist

# Expose the port uvicorn will listen on
EXPOSE 8000

# Start the server
# - host 0.0.0.0 makes it reachable from outside the container
# - workers 1 keeps the in-memory task list consistent (no shared memory across workers)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
