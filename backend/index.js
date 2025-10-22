const express = require('express');
const mongoose = require('mongoose')
const taskRoute = require('./routes/taskRoute')
const commentRoute = require('./routes/commentRoute')
const userRoute = require('./routes/userRoute')
const cookieParser = require('cookie-parser');
const cors = require('cors');

mongoose.connect('mongodb+srv://sharmakumarnetesh_db_user:IxWIOM2izz7MmgNe@cluster0.2asdhwi.mongodb.net/')

const app = express();
port = 4000;
app.use(cookieParser());
app.use(express.json());

const corsOptions = {
    origin: 'http://localhost:1234',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'auth-token']
};
app.use(cors(corsOptions));
app.use('/task', taskRoute)
app.use('/comment', commentRoute)
app.use('/user', userRoute)


app.listen(port, () => console.log('Server running at port: ', port))