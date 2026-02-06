# University Library Management (MERN)

This repository contains a minimal MERN stack web application for managing a university library's catalog.

## Structure

- `server/` Express + MongoDB API
- `client/` React UI (Vite)

## Quick start

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

In another terminal:

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

The UI runs on `http://localhost:5173` and expects the API on `http://localhost:5000`.

## Configuration

- `server/.env` uses `MONGODB_URI` and `PORT`.
- `client/.env` can override `VITE_API_URL` if the API runs elsewhere.
