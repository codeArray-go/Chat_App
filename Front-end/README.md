# Front-end — Chween

The front-end client of the real-time chat application.  
This UI is built to interact seamlessly with the backend APIs and WebSocket server to provide real-time messaging, message history retrieval, unread counts, and live chat sessions.

---

## 🧠 Features

This front-end implementation includes:

### ✔️ Core Chat Functionality
- Real-time bi-directional messaging via WebSockets.
- Render sent and received messages instantly.
- Unread message indicators and last-seen statuses (if supported by backend).
- Smooth scroll and auto-focus on new messages.
- Responsive and adaptive UI.

### ✔️ User Experience
- Login/Signup/User identity handling.
- List of chats / conversations.
- Viewing latest message previews.
- Typing indicator (optional depending on backend events).
- Clean layout with separation of components (Chats, Messages, Inputs, etc.).

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|------------|
| UI     | **React.js** |
| Styles | CSS / UI framework |
| WebSockets | **socket.io-client** / WebSocket integration |
| API Communication | **Axios** |
| Build Tool | **Vite / Create React App** |
| Routing | React Router |

*(This structure mirrors typical React chat front-end builds.)*

---

## 📁 Project Structure

```
Front-end/
│
├── public/
│ └── index.html # Main static HTML
│
├── src/
│ ├── assets/ # Images, fonts, icons
│ ├── components/ # Reusable UI components
│ │ ├── ChatWindow.jsx
│ │ ├── MessageItem.jsx
│ │ ├── Sidebar.jsx
│ │ └── ...
│ │
│ ├── context/ # (Optional) React Context providers
│ ├── hooks/ # Custom React Hooks
│ ├── services/ # API + socket services
│ │ └── socketService.js
│ ├── utils/ # Utility functions
│ ├── App.jsx # Root React component
│ └── main.jsx # App entry point
│
├── .env # Environment variables
├── vite.config.js / package.json # Build & deps config
└── README.md # This README
```

---

## 🔧 Installation

### 1) Clone the Repository
```bash
git clone https://github.com/codeArray-go/Chat_App.git
cd Chat_App/Front-end
```

### 2) Install Dependencies
```bash
npm install or yarn install
```

## ▶️ Running Locally
### Start the front-end development server:
```bash
npm run dev or yarn dev
```

## 🧩 Components Overview
### 🗂 Sidebar / Chats List
- Shows available conversations or user list
- Clicking opens corresponding chat window

### 💬 Chat Window
- Displays all messages for the active chat
- Shows send/receive time and unread highlights

### 📝 Message Input
- Text area to compose messages
- Sends message over socket + optional API persist

## 📡 API & Socket Services
The `services/` folder contains:
- **HTTP services** — Axios / fetch wrapper for REST API calls
- **Socket services** — socket event handlers

Common events:
- `connect` – socket connected
- `message` – incoming chat message
- `sendMessage` – emit new chat message
- `typing` – user is typing indicator

(These follow common real-time chat patterns.)

### 🧪 Testing
Installation:
```bash 
npm install
 ```

Running Locally:
```bash
npm run dev
 ```

## 🛠 Improvements / Future Possibilities
You can extend front-end capabilities with:
- Group chat UI support
- Message reaction / emoji support
- Push notification integration
- Offline caching (localStorage / indexedDB)

## 📌 Summary
This front-end builds a responsive real-time chat interface using React and WebSockets, structured for clarity and scalability. It pairs with the backend to handle message delivery, unread tracking, and seamless UI updates.


