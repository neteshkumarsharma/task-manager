# Task Management System

A full-featured task management system enabling users to create, organize, and track tasks with collaboration, file attachments, analytics, and real-time updates.

---

<img src="https://github.com/neteshkumarsharma/task-manager/blob/479dab1a455466ad1808ef5723a2f372f029a8db/Screenshot%20(11).png" width="300" />  <img src="https://github.com/neteshkumarsharma/task-manager/blob/7ec2a89f501da9660a3a56f814520acad72782cc/Screenshot%20(13).png" width="300" />
<img src="https://github.com/neteshkumarsharma/task-manager/blob/7ec2a89f501da9660a3a56f814520acad72782cc/Screenshot%20(12).png" width="300" />  <img src="https://github.com/neteshkumarsharma/task-manager/blob/7ec2a89f501da9660a3a56f814520acad72782cc/Screenshot%20(14).png" width="300" />




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
