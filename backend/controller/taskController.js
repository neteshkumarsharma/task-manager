const Task = require('../model/taskModel')
const Comment = require('../model/commentModel')
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

const TASKS_LIST_CACHE = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000;

function makeCacheKey(userId, query) {
    const keyObj = {
        status: query.status || '',
        title: query.title || '',
        sortBy: query.sortBy || '',
        sortOrder: query.sortOrder || 'asc',
        page: parseInt(query.page, 10) || 1,
        limit: parseInt(query.limit, 10) || 10,
    };
    return `${userId || 'anon'}:${JSON.stringify(keyObj)}`;
}

function clearTasksCache() {
    TASKS_LIST_CACHE.clear();
}

async function handleCreateTask(req, res) {
    try {
        const uniqueId = uuidv4();
        const taskData = req.body
        taskData.id = uniqueId
        taskData.user = req.body.user.userId;
        const newTask = new Task(taskData)
        await newTask.save()

        clearTasksCache();

        res.status(201).send('task added successfully')
    }
    catch (error) {
        res.status(400).send('Error creating new task:' + error.message)
    }
}

async function handleUpdateTaskStatus(req, res) {
    try {
        const taskId = req.body.id;
        const updateStatus = req.body.status;

        if (updateStatus === undefined) {
            return res.status(400).send('Status field is required');
        }

        const updatedTask = await Task.findOneAndUpdate(
            { id: taskId },
            { $set: { status: updateStatus } },
            { new: true, runValidators: true }
        );

        if (!updatedTask) {
            return res.status(404).send('Task not found');
        }

        clearTasksCache();

        res.status(200).send('Task status updated successfully');
    } catch (error) {
        res.status(400).send('Error updating task status: ' + error.message);
    }
}

async function handleDeleteTaskById(req, res) {
    try {
        const taskId = req.body.id;

        if (!taskId) {
            return res.status(400).send('Task id is required');
        }

        const deletedTask = await Task.findOneAndDelete({ id: taskId });
        await Comment.deleteMany({ taskId: taskId });
        console.log(deletedTask)

        if (!deletedTask) {
            return res.status(404).send('Task not found');
        }

        clearTasksCache();

        res.status(200).send('Task and associated comments deleted successfully');
    } catch (error) {
        res.status(400).send('Error deleting task: ' + error.message);
    }
}

async function handleGetTaskById(req, res) {
    try {
        const taskId = req.query.id;

        if (!taskId) {
            return res.status(400).send('Task id is required');
        }

        const task = await Task.findOne({ id: taskId });

        if (!task) {
            return res.status(404).send('Task not found');
        }

        res.status(200).json(task);
    } catch (error) {
        res.status(400).send('Error fetching task: ' + error.message);
    }
}

async function handleGetTasks(req, res) {
    console.log('Inside get all task')
    try {
        console.log('hellw')
        const { status, title, sortBy, sortOrder = 'asc', page = 1, limit = 10 } = req.query;
        console.log(req.query)

        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 10;
        const skip = (pageNum - 1) * limitNum;

        const userId = req.body && req.body.user ? req.body.user.userId : null;
        const cacheKey = makeCacheKey(userId, { status, title, sortBy, sortOrder, page: pageNum, limit: limitNum });

        const cached = TASKS_LIST_CACHE.get(cacheKey);
        if (cached && cached.expiresAt > Date.now()) {
            console.log('[cache] hit for', cacheKey);
            return res.status(200).json(cached.data);
        }

        let filter = {};
        if (status) filter.status = status;
        if (title) filter.title = { $regex: title, $options: 'i' };

        let sort = {};
        if (sortBy) {
            sort[sortBy] = sortOrder.toLowerCase() === 'desc' ? -1 : 1;
        }

        const totalTasks = await Task.countDocuments(filter);

        const tasks = await Task.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limitNum);

        const response = {
            page: pageNum,
            limit: limitNum,
            totalTasks,
            totalPages: Math.ceil(totalTasks / limitNum),
            tasks
        };

        TASKS_LIST_CACHE.set(cacheKey, { expiresAt: Date.now() + CACHE_TTL_MS, data: response });
        console.log('[cache] set for', cacheKey, `ttl=${CACHE_TTL_MS}ms`);

        res.status(200).json(response);
    } catch (error) {
        res.status(400).send('Error fetching tasks: ' + error.message);
    }
}

async function handleBulkCreateTasks(req, res) {
    try {
        const payload = req.body;
        if (!payload || !Array.isArray(payload.tasks)) {
            return res.status(400).json({ error: 'Request body must be JSON with a "tasks" array.' });
        }

        const tasksArray = payload.tasks;
        if (tasksArray.length === 0) {
            return res.status(400).json({ error: 'The tasks array must contain at least one task.' });
        }

        const ownerId = req.body && req.body.user && req.body.user.userId ? req.body.user.userId : undefined;

        const docs = [];
        const invalid = [];

        tasksArray.forEach((raw, idx) => {
            const title = raw && raw.title ? String(raw.title).trim() : '';
            if (!title) {
                invalid.push({ index: idx, reason: 'title is required' });
                return;
            }

            const doc = {
                id: uuidv4(),
                title,
                description: raw.description ? String(raw.description) : '',
                status: raw.status || 'PENDING',
                priority: raw.priority || 'MEDIUM',
                due_date: raw.due_date || '',
                tags: raw.tags || '',
                assigned_to: raw.assigned_to || '',
                user: ownerId,
                attachments: Array.isArray(raw.attachments) ? raw.attachments.map(a => ({
                    filename: a.filename || '',
                    originalName: a.originalName || a.filename || '',
                    url: a.url || '',
                    size: a.size || 0,
                    mimeType: a.mimeType || '',
                    uploadedAt: a.uploadedAt || new Date()
                })) : []
            };

            docs.push(doc);
        });

        if (docs.length === 0) {
            return res.status(400).json({ error: 'No valid tasks to create', invalid });
        }

        const inserted = await Task.insertMany(docs, { ordered: false });

        try { clearTasksCache(); } catch (e) { }

        const createdIds = inserted.map(t => t.id || String(t._id));
        const result = { created: inserted.length, createdIds };
        if (invalid.length) result.invalid = invalid;

        res.status(201).json(result);
    } catch (err) {
        console.error('handleBulkCreateTasks error:', err);
        const message = err && err.message ? err.message : 'Failed to bulk create tasks';
        res.status(500).json({ error: message });
    }
}

module.exports = {
    handleCreateTask,
    handleUpdateTaskStatus,
    handleDeleteTaskById,
    handleGetTaskById,
    handleGetTasks,
    handleBulkCreateTasks,
    clearTasksCache
}