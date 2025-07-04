# Collaborative Whiteboard

This is a real-time collaborative drawing application built using React, Node.js, and Socket.IO. It allows multiple users to draw on the same whiteboard at the same time. Users can also see each other's live cursor movements and drawing actions.

---

## Features

- Real-time drawing and synchronization across users
- Live cursor tracking for all connected users
- Avatars and colors to differentiate users
- Pen and eraser tools
- Ability to choose pen color and stroke width
- Undo last drawing stroke
- Save whiteboard as an image
- Connection status and user count display

---

## Tech Stack

- Frontend: React (with Vite), Socket.IO Client
- Backend: Node.js, Express, Socket.IO
- Database (optional): MongoDB

---

## How to Run Locally

### 1. Clone the repository

In The Terminal
git clone https://github.com/moin-prog/collaborative-whiteboard.git
cd collaborative-whiteboard

### 2. Set Up The Server

In The Terminal 
cd client
npm install
npm run dev

### 3. Create a .env file (mongodb)
MONGO_URI=your_mongodb_connection_string
PORT=5000


