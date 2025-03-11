# Everstory - Frontend

This is the frontend for Everstory, a memory-driven social platform where users can store, organize, and relive their most cherished moments. Built using React, TypeScript, and best practices for scalability and performance.

## 🚀 Features

- 🔑 JWT-based authentication (Signup, Login, Logout)
- 🔐 Protected routes & session persistence
- 📸 Image upload with privacy settings (Public/Private)
- 🎥 Virtualized post feed with infinite scrolling
- 🔎 Debounced search for efficient post discovery
- 👥 Friend system (Follow/Unfollow, Friend List)
- 🔄 Real-time updates using WebSockets
- 🎨 Modern UI with TailwindCSS

## 🛠️ Tech Stack

- **Frontend:** React + TypeScript + Vite
- **State Management:** Redux
- **UI Components:** TailwindCSS
- **Routing:** React Router
- **Image Handling:** Cloudinary
- **API Calls:** Axios + React Query
- **Real-time updates:** WebSockets

## 🔧 Setup & Installation

1. Clone the repository:

   ```
   git clone git@github.com:VarunRam7/Everstory-UI.git
   cd everstory-frontend
   ```

2. ENV File Setup

   Create a .env file in the root directory and add:

   ```
   VITE_AUTH_BE_HOST=http://localhost:5000
   VITE_IMAGE_BE_HOST=http://localhost:5001
   VITE_FRIENDSHIP_BE_HOST=http://localhost:5002
   VITE_EMAIL_TEMPLATE_ID = template_6swoihz
   VITE_EMAIL_SERVICE_ID = service_xocybwp
   VITE_PUBLIC_KEY = BS5kFCcUPlFCzjdK0
   VITE_FRONTEND_URL = http://localhost:5173
   ```

```

3. Install Dependencies

```

npm install

```

## 🔧 Docker Setup and Running

1. Docker Build

```

docker build -t front-end .

```

2. Docker Run

```

docker run -d --name everstory-ui --network mynetwork -p 5173:80 front-end

```

--------------------
## Demo
[Walkthrough Video](https://drive.google.com/file/d/1goLYTaKcQZ5BnPQ4_ri1giGRPy_jnaL7/view?usp=sharing)
```
