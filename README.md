GramBazaar - Hyperlocal marketplace for West Bengal villages

This repository contains a Vite React frontend and an Express + MongoDB backend.

Directories:
- client/ - React frontend (Vite)
- server/ - Express API with Mongoose

Run locally:

- Start MongoDB (e.g., run mongod)
- Start server:
	cd server
	npm install
	copy .env.example .env
	npm run dev
- Start client:
	cd client
	npm install
	set VITE_API_BASE=http://localhost:5000
	npm run dev

See each folder README for details.
