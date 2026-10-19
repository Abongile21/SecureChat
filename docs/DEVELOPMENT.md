# Development Guide

## Stack

- React 18 and Vite frontend
- Node.js, Express, TypeScript, and Socket.IO backend
- MongoDB Atlas using the official MongoDB Node.js driver
- OpenRouter API for AI responses
- JWT and bcryptjs for authentication

## Setup

1. Install Node.js 18+, npm, Ollama, and an Ollama model.
2. Copy `backend/.env.example` to `backend/.env`.
3. Set the MongoDB Atlas URI, database name, JWT secret, and Ollama settings.
4. Start the backend with `cd backend; npm install; npm run dev`.
5. Start the frontend with `cd frontend; npm install; npm run dev`.

MongoDB collections and indexes are initialized by the backend connection module. Do not run SQL migrations or seed commands.

## Validation

```powershell
cd backend
npm run type-check
npm run build
npm test

cd ..\frontend
npm run build
```

## Environment

Never expose `MONGODB_URI`, `JWT_SECRET`, or Ollama credentials through frontend `VITE_*` variables. The frontend only needs the backend API URL.
