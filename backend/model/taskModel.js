const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['COMPLETED', 'PENDING', 'DEFERRED'],
        required: true
    },
    priority: {
        type: String,
        enum: ['HIGH', 'MEDIUM', 'LOW'],
        required: true
    },
    due_date: {
        type: String,
        required: true
    },
    tags: {
        type: String,
        required: true
    },
    assigned_to: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task;