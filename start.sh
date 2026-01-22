#!/bin/bash

# Start backend
cd backend
npm install
npm start &

# Start frontend
cd ../frontend
npm install
npm run build
npm run preview
