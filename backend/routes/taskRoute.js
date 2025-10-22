const express = require('express');
const { handleCreateTask, handleUpdateTaskStatus, handleDeleteTaskById, handleGetTaskById, handleGetTasks, handleBulkCreateTasks } = require('../controller/taskController');
const { fetchUser } = require('../controller/userController');
const apiRateLimiter = require('../middleware/rateLimiter');
const router = express.Router()

router.post('/create', apiRateLimiter, fetchUser, handleCreateTask)
router.post('/create/bulk', apiRateLimiter, fetchUser, handleBulkCreateTasks)
router.post('/update', apiRateLimiter, fetchUser, handleUpdateTaskStatus)
router.delete('/delete', apiRateLimiter, fetchUser, handleDeleteTaskById)
router.get('/get-all-tasks', fetchUser, handleGetTasks)
router.get('/', fetchUser, handleGetTaskById)


module.exports = router