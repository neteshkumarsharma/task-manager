const { v4: uuidv4 } = require('uuid');
const Comment = require('../model/commentModel');
const Task = require('../model/taskModel');
const jwt = require('jsonwebtoken');

async function handleCreateComment(req, res) {
    try {
        const { content, author, taskId } = req.body;

        if (!content || !author || !taskId) {
            return res.status(400).json({
                success: false,
                message: 'Content, author, and taskId are required.'
            });
        }

        const task = await Task.findOne({ id: taskId });
        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found.'
            });
        }

        const commentId = uuidv4();


        const newComment = new Comment({
            id: commentId,
            content,
            author,
            taskId
        });
        await newComment.save();
        await Task.findOneAndUpdate(
            { id: taskId },
            { $push: { comments: newComment._id } }
        );



        res.status(201).json({
            success: true,
            message: 'Comment added successfully',
            data: newComment
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating comment',
            error: error.message
        });
    }
}
async function handleUpdateComment(req, res) {
    try {
        const { content, author, id: commentId } = req.body;
        if (!commentId) {
            return res.status(400).json({
                success: false,
                message: 'Comment ID is required'
            });
        }

        const updateData = {};
        if (content !== undefined) updateData.content = content;
        if (author !== undefined) updateData.author = author;

        const updatedComment = await Comment.findOneAndUpdate(
            { id: commentId },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedComment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Comment updated successfully',
            data: updatedComment
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating comment',
            error: error.message
        });
    }
}
async function handleDeleteComment(req, res) {
    try {
        const commentId = req.body.id;

        if (!commentId) {
            return res.status(400).json({
                success: false,
                message: 'Comment ID is required'
            });
        }

        const deletedComment = await Comment.findOneAndDelete({ id: commentId });

        if (!deletedComment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Comment deleted successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error deleting comment',
            error: error.message
        });
    }
}
async function handleGetCommentsByTask(req, res) {
    try {
        const taskId = req.params.taskId;

        if (!taskId) {
            return res.status(400).json({
                success: false,
                message: 'Task ID is required'
            });
        }

        const comments = await Comment.find({ taskId });

        res.status(200).json({
            success: true,
            count: comments.length,
            data: comments
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error fetching comments',
            error: error.message
        });
    }
}

const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).json({ error: 'Please authenticate using a valid token.' });
    }
    try {
        const data = jwt.verify(token, process.env.JWT_KEY || 'jwt_secret');
        req.user = data;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Please authenticate using a valid token.' });
    }
};

module.exports = {
    handleCreateComment,
    handleUpdateComment,
    handleDeleteComment,
    handleGetCommentsByTask,
    fetchUser
};
