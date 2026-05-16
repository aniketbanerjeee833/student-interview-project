# Student Project

A full-stack student management app with a React + Vite frontend and an Express + MongoDB backend.

## GitHub Repository

This repository is designed for GitHub and can be pushed to any GitHub repo after cloning.

## Tech Stack

- Frontend: React, Vite, TypeScript
- Forms: react-hook-form, zod
- Backend: Express, TypeScript, MongoDB, Mongoose
- Security: AES encryption, bcrypt password hashing, CORS

## Project Structure

- `client/` — React frontend built with Vite
- `server/` — Express backend with TypeScript and MongoDB

## Features

- Login form with email and password validation
- Student registration form with the following fields:
  - Full Name
  - Email
  - Phone Number
  - Date of Birth
  - Gender
  - Address
  - Course Enrolled
  - Password
- CRUD operations for student records
- API routes:
  - `POST /api/register`
  - `GET /api/students`
  - `PUT /api/student/:id`
  - `DELETE /api/student/:id`
- Frontend encryption layer before sending data to the backend
- Backend double-encryption and secure password hashing

## How Encryption Is Implemented

### Frontend Encryption

- The client encrypts form values before sending them to the backend.
- Each sensitive field is encrypted using the browser Web Crypto API.
- The login form encrypts the email and password before request submission.

### Backend Encryption

- The server applies a second AES encryption layer to all incoming student fields.
- Passwords receive an additional bcrypt hash after backend encryption.
- This creates a 2-layer protection model:
  1. Frontend AES encryption
  2. Backend AES encryption + bcrypt hashing for passwords

### Data Flow

- Frontend encrypts values and sends JSON to `/api/register` or `/api/student/:id`.
- Backend decrypts its layer only as needed and stores encrypted data in MongoDB.
- Retrieved student data is returned with only the frontend encryption layer removed.

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- MongoDB connection string

### Setup

1. Clone the repository

```bash
git clone <repo-url>
cd student-project
```

2. Install dependencies for both backend and frontend

```bash
cd server
npm install
cd ../client
npm install
```

### Environment

Create a `.env` file in `server/` with at least:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/studentdb
BACKEND_ENCRYPTION_KEY=your-backend-secret
```

Optionally add a `client/.env` file for frontend environment values like API base URL if needed.

### Run the App

Start the backend:

```bash
cd server
npm run dev
```

Start the frontend:

```bash
cd client
npm run dev
```

- Frontend default: `http://localhost:5173`
- Backend default: `http://localhost:5000`

## Available Scripts

### Backend

- `npm run dev` — start server in development with `ts-node-dev`
- `npm run build` — compile TypeScript in `server`
- `npm start` — run compiled server from `dist/`

### Frontend

- `npm run dev` — start Vite development server
- `npm run build` — build production frontend
- `npm run preview` — preview production build

## Notes<img width="1927" height="1087" alt="student-project-1" src="https://github.com/user-attachments/assets/2fd935d2-a6d6-46c0-af4b-5ec0fc6bcc6c" />


- Backend routes are mounted under `/api`
- Frontend forms use `react-hook-form` + `zod` validation
- Sensitive data is encrypted before storage in MongoDB

