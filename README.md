# Workflow Tracker

Mini application workflow tracker built with a Django + Django Ninja backend and a React frontend.

Author: Felix Ondullah  
Email: felixondullah@gmail.com

## Project Structure

```text
Tracker/
├── backend/   # Django + Django Ninja API
└── frontend/  # React + Vite UI
```

## Features

- Create application drafts
- Edit draft and need-more-information applications
- Submit and resubmit applications
- Move submitted applications into review
- Record reviewer decisions for approved, rejected, or need-more-information outcomes
- Enforce workflow rules on the backend
- Show status-aware actions in the frontend

## Workflow

`Draft -> Submitted -> Under Review -> Need More Information / Approved / Rejected`

## Backend Setup

1. Create a virtual environment:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

2. Install backend dependencies:

```bash
pip install -r backend/requirements.txt
```

3. Run migrations:

```bash
python backend/manage.py migrate
```

4. Start the backend server:

```bash
python backend/manage.py runserver
```

The backend will be available at `http://127.0.0.1:8000/`.

## Frontend Setup

1. Install frontend dependencies:

```bash
cd frontend
npm install
```

2. Start the frontend:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173/`.

## Running Checks

Backend tests:

```bash
source .venv/bin/activate
python backend/manage.py test applications
```

Frontend production build:

```bash
cd frontend
npm run build
```

## API Endpoints

- `POST /api/applications` - Create application draft
- `GET /api/applications` - List applications
- `GET /api/applications/{id}` - View application details
- `PUT /api/applications/{id}` - Update editable application
- `POST /api/applications/{id}/submit` - Submit or resubmit application
- `POST /api/applications/{id}/start-review` - Start review
- `POST /api/applications/{id}/decision` - Record reviewer decision

## Assumptions Made

- A single API serves both applicant and reviewer actions.
- Authentication and role-based permissions were not required for this take-home, so workflow restrictions are enforced at the application level.
- SQLite is used for simplicity and fast local setup.
- Tracking numbers are auto-generated server-side.
- Need More Information applications follow the same edit form and re-enter the workflow through resubmission.

## What I Would Improve With More Time

- Add authentication, reviewer roles, and audit trails.
- Add filtering, search, and pagination on the application list.
- Add frontend form validation and toast notifications.
- Add API integration tests and frontend component tests.
- Add environment-based settings and Docker support.

## Screenshots / Walkthrough

Not included in this repository, but the UI is ready to run locally for a quick walkthrough.
