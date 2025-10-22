const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const User = require('../model/userModel');
const { v4: uuidv4 } = require('uuid');

async function handleRegisterUser(req, res) {
    try {
        const { username, password, email, name, age, gender } = req.body;

        if (!username || !password || !email) {
            return res.status(400).json({ message: 'All fields are required.' })
        }

        const existingUser = await User.findOne({ $or: [{ username }, { email }] })
        if (existingUser) {
            return res.status(409).json({ message: 'Username or email already exists.' })
        }

        const userId = uuidv4();

        const user = new User({ username, email, password, id: userId, name, age, gender });
        await user.save()
        res.status(201).json({ message: "User Registered Successfully" })
    }
    catch (error) {
        res.status(500).json({ message: 'Error registering user', eroor: error.message })
    }
}

async function handleUserLogin(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET || 'jwt_secret',
            { expiresIn: '1h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000
        });

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ message: 'Error during login', error: error.message });
    }
}

function handleUserLogout(req, res) {
    res.status(200).json({ message: 'Logout successful. Please delete your token on the client side.' });
}

const handleCurrentUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.body.user.userId).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const fetchUser = async (req, res, next) => {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: 'Please authenticate using a valid token.' });
    }
    try {
        const data = jwt.verify(token, process.env.JWT_KEY || 'jwt_secret');
        req.body = {
            ...req.body,
            user: data
        }
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Please authenticate using a valid token.' });
    }
};


module.exports = {
    handleRegisterUser,
    handleUserLogin,
    handleUserLogout,
    handleCurrentUserProfile,
    fetchUser
}