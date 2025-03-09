# Project Management System

## 📌 Overview
The **Project Management System** is a frontend-only web application built using **React** and **Vite**, designed to help users organize and manage their projects effectively. It features task creation, tracking, and a clean UI with smooth animations.

## 🚀 Features
- **Create and Manage Tasks**: Add, edit, and delete tasks with ease.
- **Project Organization**: Group tasks by project for better management.
- **Animations & UI Enhancements**: A visually appealing interface with creative buttons.
- **Firebase Integration**: Store and retrieve form data for tasks.

## 🛠️ Tech Stack
- **Frontend**: React, Vite
- **State Management**: React Context API (or Redux if applicable)
- **Database**: Firebase (for data storage)

## 📂 Folder Structure
```
Project_Management_System/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/             # Main pages (Dashboard, Tasks, etc.)
│   ├── firebase.js        # Firebase configuration
│   ├── App.jsx            # Main application component
│   ├── main.jsx           # Entry point
│   ├── styles/            # CSS or Styled Components
├── public/                # Static assets
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
└── README.md              # Project documentation
```

## 🔧 Installation & Setup
1. **Clone the repository**
   ```bash
   git clone https://github.com/SudharsaaX/Project_Management_System.git
   cd Project_Management_System
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Set up Firebase**
   - Create a Firebase project.
   - Configure Firestore and enable necessary services.
   - Update `firebase.js` with your Firebase configuration.

## 📌 Firebase Integration Guide
- Ensure that **Firebase Firestore** is enabled.
- Modify `firebase.js` with the Firebase SDK credentials.
- Use Firebase functions to store and retrieve tasks.

## 🚀 Deployment
To deploy the project:
```bash
npm run build
```
You can deploy the `dist/` folder on **Vercel**, **Netlify**, or any static hosting platform.

## 🤝 Contributing
1. Fork the repository
2. Create a new branch (`feature-branch`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push to your branch (`git push origin feature-branch`)
5. Open a Pull Request

## 📧 Contact
For any queries, feel free to reach out:
- **GitHub**: [SudharsaaX](https://github.com/SudharsaaX)
- **Email**: sudharsan1527@gmail.com
