# Task Management System

A full-featured task management system enabling users to create, organize, and track tasks with collaboration, file attachments, analytics, and real-time updates.

---

## Features

### Backend APIs

- **Authentication**
  - Register new users
  - User login
  - Get current authenticated user profile

- **Task Operations**
  - Create tasks with properties: title, description, status, priority, due date, tags, assigned users
  - Retrieve all tasks with filtering, searching, sorting, and pagination
  - Get, update, soft-delete tasks by ID
  - Bulk creation of tasks

- **Comments**
  - Add comments to tasks
  - Retrieve, update, and delete comments

- **Analytics**
  - Task overview statistics (counts by status, priority)
  - User performance metrics
  - Task trends over time
  - Export tasks data for reporting

### Frontend Features

- Authentication (Login/Register)
- Dashboard with overview statistics
- Task list with filtering, search, sorting, and pagination
- Detailed task view with comments and attachments
- Create and edit tasks and comments
- User profile management
- Analytics and reports with charts and trends
- Responsive design with dark mode support
- Confirmation dialogs, loading, error, and empty states
- Custom styled UI built with React and hooks
- Client-side routing and state management without CSS frameworks
- Performance optimized for seamless user experience

---

## Technical Stack

- **Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT Authentication
- **Frontend:** React.js with Hooks, React Router
- **Analytics & Visualization:** Chart.js
- **API Documentation:** Postman
- **Security:** CORS, rate limiting

---

## Installation and Setup

### Backend

## API Endpoints Overview

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

- `POST /api/tasks` - Create new task
- `GET /api/tasks` - Get tasks list (filter, sort, paginate)
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Soft delete task
- `POST /api/tasks/bulk` - Bulk create tasks

- `POST /api/tasks/:taskId/comments` - Add comment
- `GET /api/tasks/:taskId/comments` - Get comments for task
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

- `POST /api/tasks/:taskId/files` - Upload files
- `GET /api/files/:fileId` - Download file
- `DELETE /api/files/:fileId` - Delete file

- `GET /api/analytics/overview` - Task overview stats
- `GET /api/analytics/performance` - User performance metrics
- `GET /api/analytics/trends` - Task trends over time
- `GET /api/analytics/export` - Export task data
