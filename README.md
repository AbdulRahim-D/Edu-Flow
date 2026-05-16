
# Edu-Flow

> **A Real-Time Academic Workflow & Assignment Tracker**

![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge&logo=mongodb)
![Socket.io](https://img.shields.io/badge/RealTime-Socket.io-black?style=for-the-badge&logo=socket.io)
![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![Vite](https://img.shields.io/badge/Bundler-Vite-646CFF?style=for-the-badge&logo=vite)

🌐 **Live Demo:** [Edu-Flow Web App](https://edu-flow-six.vercel.app)

Edu-Flow is a comprehensive academic tracking platform designed to bridge the communication gap between educators and students. By leveraging WebSockets for real-time synchronization and a Kanban-style interface, it transforms traditional assignment management into a dynamic, interactive experience.

---

## Key Features

**For Educators**
* **Workspace Management:** Create secure, isolated digital classrooms accessible via unique class codes.
* **Task Delegation:** Distribute assignments with strict deadlines, descriptions, and subject tags.
* **Real-Time Monitoring:** Observe student progress live as they move tasks across different pipeline stages.
* **Instant Evaluation:** Grade submissions and provide immediate feedback without requiring page reloads.
* **Performance Analytics:** Gain insights into class performance through MongoDB-powered data aggregation.

**For Students**
* **Kanban Interface:** Manage and prioritize assignments visually using drag-and-drop mechanics.
* **Event-Driven Sync:** Receive instant updates for newly assigned tasks, upcoming deadlines, and graded work.
* **Streamlined Submissions:** Submit project links and documentation securely before deadline locks are enforced.

**Architecture & Security**
* **Role-Based Access Control (RBAC):** Strict JWT authentication ensures isolated views and restricted actions based on user roles.
* **Optimistic Updates:** Powered by Redux Toolkit (RTK Query) for a zero-latency, highly responsive user interface.

---

## Tech Stack

* **Client-Side:** React.js (Vite), Tailwind CSS v4, Redux Toolkit, react-beautiful-dnd, Framer Motion.
* **Server-Side:** Node.js, Express.js.
* **Database:** MongoDB, Mongoose.
* **Real-Time Communication:** Socket.IO.
* **Security & Auth:** JWT, Bcrypt.js, Cookie Parser.

---

## Getting Started

Follow these instructions to set up the project locally for development and testing purposes.

### Prerequisites
* Node.js installed on your local machine.
* A running instance of MongoDB (Local or Atlas).

### 1. Clone the Repository
```bash
git clone https://github.com/AbdulRahim-D/Edu-Flow.git
cd edu-flow

```

### 2. Backend Setup

Navigate to the server directory and install dependencies:

```bash
cd backend
npm install

```

Create a `.env` file in the root of the `backend` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
FRONTEND_URL=http://localhost:5173

```

Start the backend development server:

```bash
node index

```

### 3. Frontend Setup

Open a new terminal session, navigate to the client directory, and install dependencies:

```bash
cd frontend
npm install

```

Create a `.env` file in the root of the `frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api

```

Start the Vite development server:

```bash
npm run dev

```

---

## Team

Developed as a comprehensive End-to-End Academic Project by:

* **Abdul Rahim Dudekula** – Backend Architecture & Real-time Integration
* **Naveen Manjula** – Frontend Development & UI/UX Design
* **Trinadh Kora** – Database Design & DevOps

*Note: This application was built to demonstrate advanced MERN stack concepts, including WebSocket integration, robust state management with RTK Query, and strict backend middleware security.*
