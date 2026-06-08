# InvManager

InvManager is an inventory management application with a React frontend and a FastAPI backend. It supports product, customer, and order management, and is containerized with Docker for easy deployment.

## Project Links

- GitHub Repository: https://github.com/JitendraDubey2004/InvManager
- Live Frontend: https://inv-manager-2u55.vercel.app/
- Backend API Docs: https://inventory-backend-api-pbcz.onrender.com/docs
- Docker Hub Backend Image: https://hub.docker.com/r/jitendradubey0122/inventory-backend

## Repository Structure

- `Backend/`
  - `Dockerfile` - Backend container image definition.
  - `requirements.txt` - Python dependencies.
  - `app/` - FastAPI application code.
    - `main.py` - FastAPI application entry point.
    - `models.py` - SQLAlchemy models.
    - `schemas.py` - Pydantic request/response schemas.
    - `api/routes/` - Backend API route modules.
    - `core/` - Configuration, database, and logger setup.
    - `tests/` - Backend tests.

- `frontend/`
  - `Dockerfile` - Frontend container image definition.
  - `package.json` - Frontend dependencies and scripts.
  - `src/` - React application source code.
    - `api/` - Axios client configuration.
    - `components/` - UI components.
    - `pages/` - Application pages.
    - `store/` - Redux store and slices.

- `docker-compose.yml` - Compose file to launch the database, backend, and frontend together.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Redux Toolkit, React Router
- Backend: FastAPI, SQLAlchemy, PostgreSQL, Pydantic
- Deployment: Docker, Docker Compose, Vercel, Render

## Local Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/JitendraDubey2004/InvManager.git
   cd InvManager
   ```

2. Create and configure `.env` with your PostgreSQL and app settings.

3. Start services with Docker Compose:
   ```bash
   docker compose up --build
   ```

4. Open the frontend in your browser:
   - `http://localhost:5173`

5. Open the backend Swagger docs:
   - `http://localhost:8000/docs`

## Frontend Scripts

From `frontend/`:

- `npm run dev` - start development server
- `npm run build` - build production assets
- `npm run preview` - preview production build
- `npm run lint` - run ESLint

## Backend Notes

The backend is built with FastAPI and uses PostgreSQL for persistence. Database configuration is provided via environment variables, and the `docker-compose.yml` file defines a `db` service for local development.

## Contact

For more information, visit the GitHub repository or the live application links above.
