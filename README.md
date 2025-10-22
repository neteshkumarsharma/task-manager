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

- **File Operations**
  - Upload multiple files per task with validation
  - Download and delete files

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
- File upload with drag-and-drop functionality
- Confirmation dialogs, loading, error, and empty states
- Custom styled UI built with React, TypeScript, and hooks
- Client-side routing and state management without CSS frameworks
- Performance optimized for seamless user experience

### Bonus Features

- Real-time updates through WebSockets
- Email notifications for updates and assignments
- Background job processing for long-running tasks
- Caching layer for optimized API performance
- Markdown support in comments
- Comprehensive testing suite
- Docker-based development and deployment setup

---

## Technical Stack

- **Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT Authentication
- **Frontend:** React.js with Hooks, TypeScript, React Router
- **File Storage:** Local file system / Cloud storage (e.g. AWS S3 - optional)
- **Real-time:** Socket.IO (WebSockets)
- **Analytics & Visualization:** Chart.js / D3.js or similar
- **API Documentation:** Swagger / Postman
- **Security:** CORS, rate limiting, input sanitization, validation with Joi or Yup

---

## Installation and Setup

### Backend

1. Clone the repository
2. Install dependencies:
