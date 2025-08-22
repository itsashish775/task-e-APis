# Task Management API

A simple **Node.js + Express + Sequelize** API for managing users and tasks.  
This project demonstrates clean architecture with controllers, services, and centralized request handling.

---

## 🚀 Features
- User registration & login  
- Task creation, update, delete  
- Centralized request/response handler  
- Sequelize ORM with MySQL  
- Environment variable validation  

---

## 🛠️ Tech Stack
- **Node.js** (Express.js)  
- **Sequelize ORM**  
- **MySQL** database  
- **dotenv** for environment variables  

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/your-username/task-api.git

# Go into the project folder
cd task-api

# Install dependencies
npm install


.
├── controllers/
│   ├── userController.js
│   └── taskController.js
├── services/
│   ├── userService.js
│   └── taskService.js
├── models/
│   ├── user.js
│   └── task.js
├── middlewares/
│   └── centralHandler.js
├── config/
│   └── db.js
├── .env
├── .gitignore
├── package.json
└── README.md
