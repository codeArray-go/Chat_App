# Real-Time Chat Application

A full-stack real-time chat application built with modern web technologies.  
This project enables users to communicate instantly with features like live messaging, unread message tracking, and real-time updates using WebSockets.

<img width="1309" height="671" alt="image" src="https://github.com/user-attachments/assets/460efe2a-1663-4461-9a17-1ade4f498a27" />


---

## 🚀 Project Overview

This chat application provides:

- Real-time one-to-one messaging
- Unread message count & seen status handling
- Instant UI updates using WebSockets
- Authentication-based user sessions
- Scalable architecture separating client and server logic

The goal of this project is to demonstrate **production-level full-stack development practices** including state management, socket communication, database aggregation, and deployment readiness.

---

## 🧩 Architecture

The project is divided into two main parts:

### Frontend
Handles:

- User interface and chat experience  
- Real-time message rendering  
- Notification & unread count display  
- API and socket communication with backend  

Frontend implementation details are documented separately inside the frontend directory.

---

### Backend
Responsible for:

- User management  
- Message storage and retrieval  
- Unread count aggregation logic  
- Real-time socket events and message delivery 

Backend technical details are documented separately inside the backend directory.

---

## ⚙️ Core Features

- 🔴 **Real-time messaging using WebSockets**
- 👁️ **Seen / unseen message tracking**
- 🔔 **Unread notification counts per user**
- 🌐 **Deployment-ready full-stack structure**

---

## 📁 Repository Structure

```
root/
│
├── frontend/ # Client application
├── backend/ # Server & APIs
└── README.md # Project overview
```

---

## 🛠️ Tech Stack (High Level)

**Frontend**
- Modern JavaScript framework (React.js),
- State management (Zustand),
- Socket client integration
- Responsive UI

**Backend**
- Node.js runtime
- Express.js server
- MongoDB database
- Socket.io for real-time communication

---

## 📌 Purpose of the Project

This project was built as a **learning-driven production-style application** to:

- Strengthen full-stack development skills  
- Understand real-time system design  
- Practice deployment of separate frontend & backend services also on same platform.

---

## 📄 License

This project is open for learning and personal development use.

