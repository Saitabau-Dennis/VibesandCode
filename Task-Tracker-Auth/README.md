# Task Tracker App with Authentication

A full-featured task management application built with React, Tailwind CSS, and JSON Server for backend simulation.

## Features

- **User Authentication**: Registration and login with email/password
- **Protected Routes**: Only authenticated users can access the dashboard
- **Task Management**: Create, read, update, and delete tasks
- **Task Properties**:
  - Title and description
  - Priority levels (Low, Medium, High)
  - Due dates
  - Completion status
- **User-specific Data**: Each user sees only their own tasks
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React 18, React Router DOM
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Backend**: JSON Server (for development)
- **Build Tool**: Vite

## Project Structure

```
src/
├── components/
│   ├── Dashboard.jsx       # Main dashboard with task overview
│   ├── Login.jsx          # Login form component
│   ├── Register.jsx       # Registration form component
│   ├── Navbar.jsx         # Navigation bar
│   ├── ProtectedRoute.jsx # Route protection wrapper
│   ├── TaskForm.jsx       # Task creation/editing form
│   └── TaskList.jsx       # Task display component
├── contexts/
│   └── AuthContext.jsx    # Authentication state management
├── services/
│   └── api.js             # API service functions
├── App.jsx                # Main app component
├── main.jsx               # App entry point
└── index.css              # Tailwind CSS imports
```

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the JSON Server** (in one terminal):
   ```bash
   npm run server
   ```
   This will start the backend server on `http://localhost:3001`

3. **Start the development server** (in another terminal):
   ```bash
   npm run dev
   ```
   This will start the React app on `http://localhost:5173`

### Usage

1. **Register a new account** or use the default account:
   - Email: `john@example.com`
   - Password: `password123`

2. **Login** to access the dashboard

3. **Manage tasks**:
   - Click "Add New Task" to create a task
   - Click the edit icon to modify a task
   - Click the delete icon to remove a task
   - Check the checkbox to mark tasks as complete

## API Endpoints

The JSON Server provides the following endpoints:

- `GET /users` - Get all users
- `POST /users` - Create a new user
- `GET /users?email=<email>` - Get user by email
- `GET /tasks` - Get all tasks
- `GET /tasks?userId=<userId>` - Get tasks for a specific user
- `POST /tasks` - Create a new task
- `PUT /tasks/<id>` - Update a task
- `DELETE /tasks/<id>` - Delete a task

## Key Learning Concepts

### 1. Authentication Flow
- User registration with validation
- Login with email/password verification
- Session persistence using localStorage
- Logout functionality

### 2. State Management
- **Context API**: Global authentication state
- **useReducer**: Complex state logic for auth
- **Local State**: Component-level state for forms
- **Lifting State Up**: Sharing state between components

### 3. Protected Routes
- Route guards based on authentication status
- Automatic redirection for unauthenticated users
- Loading states during authentication check

### 4. CRUD Operations
- **Create**: Add new tasks
- **Read**: Display user's tasks
- **Update**: Edit existing tasks
- **Delete**: Remove tasks

### 5. HTTP Client Usage
- Axios for API calls
- Error handling
- Loading states
- RESTful API interaction

## Styling Features

- **Responsive Design**: Mobile-first approach
- **Modern UI**: Clean and intuitive interface
- **Interactive Elements**: Hover effects and transitions
- **Status Indicators**: Visual feedback for task completion
- **Priority Colors**: Color-coded priority levels
- **Loading Animations**: Spinners for better UX

## Customization

### Adding New Task Fields
1. Update the `TaskForm.jsx` component
2. Modify the form state in `Dashboard.jsx`
3. Update the database schema in `db.json`

### Styling Changes
- Modify Tailwind classes in components
- Add custom CSS in `index.css`
- Update color schemes in `tailwind.config.js`

### Adding Features
- Task categories/tags
- Task search and filtering
- Email notifications
- Task sharing between users
- File attachments

## Troubleshooting

### Common Issues

1. **JSON Server not starting**: Make sure port 3001 is available
2. **CORS errors**: JSON Server includes CORS headers by default
3. **Authentication not persisting**: Check localStorage in browser dev tools
4. **Tasks not loading**: Verify JSON Server is running and accessible

### Development Tips

- Use React Developer Tools for debugging
- Check Network tab for API call issues
- Use console.log for state debugging
- Verify data structure in `db.json`

## Next Steps

This project demonstrates core concepts for building authenticated web applications. Consider extending it with:

- Real backend integration (Node.js/Express, Python/Django, etc.)
- Advanced authentication (JWT tokens, refresh tokens)
- Database integration (MongoDB, PostgreSQL)
- Advanced state management (Redux, Zustand)
- Testing (Jest, React Testing Library)
- Deployment (Vercel, Netlify, Heroku)

## License

This project is created for educational purposes.
