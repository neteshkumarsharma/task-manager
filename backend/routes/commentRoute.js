const express = require('express')
const { handleCreateComment, handleUpdateComment, handleDeleteComment, handleGetCommentsByTask } = require('../controller/commentController')
const { fetchUser } = require('../controller/userController')
const apiRateLimiter = require('../middleware/rateLimiter')

const router = express.Router()

router.post('/create', apiRateLimiter, fetchUser, handleCreateComment)
router.post('/update', apiRateLimiter, fetchUser, handleUpdateComment)
router.delete('/', apiRateLimiter, fetchUser, handleDeleteComment)
router.get('/:taskId/comments', fetchUser, handleGetCommentsByTask);

module.exports = router;