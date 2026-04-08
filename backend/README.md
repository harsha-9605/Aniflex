# Animeflex FastAPI Backend

This is the FastAPI backend for the Animeflex application.

## Prerequisites
- Python 3.9+ (developed with Python 3.12)

## Setup

1. The virtual environment is already created in the `venv` directory.
2. Dependencies are already installed.

## Running the Server

To start the FastAPI development server, run the following command from the `backend` directory:

```bash
# On Windows
.\venv\Scripts\uvicorn main:app --reload

# On macOS/Linux
./venv/bin/uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.
You can access the interactive API documentation (Swagger UI) at `http://localhost:8000/docs`.
