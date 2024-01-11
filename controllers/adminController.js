const Admin = require('../models/adminModel');
const User = require('../models/userModel')
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

const path = require('path');
const ejs = require('ejs');

//GET LOGIN
const loadLogin = async (req, res) => {
    try {
        // res.json({ status: 'success', message: 'Login API called successfully' });
        res.render('login');
    } catch (error) {
        // res.status(500).json({ status: 'error', message: 'An error occurred' });
        console.log(error.message);
    }
}

const loadDashboard = async (req, res) => {
    try {
        // res.json({ status: 'success', message: 'Login API called successfully' });
        res.render('dashboard');
    } catch (error) {
        // res.status(500).json({ status: 'error', message: 'An error occurred' });
        console.log(error.message);
    }
}

const loadchangepassword = async (req, res) => {
    try {
        // res.json({ status: 'success', message: 'Login API called successfully' });
        res.render('changePassword');
    } catch (error) {
        // res.status(500).json({ status: 'error', message: 'An error occurred' });
        console.log(error.message);
    }
}
//VERIFY LOGIN
const verifyAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const adminData = await Admin.findOne({ email: email });
        if (adminData) {
            const passwordMatch = await bcrypt.compare(password, adminData.password)
            if (passwordMatch) {
                const secretKey = "secret";
                const expiration = 10000;
                const adminId = adminData._id;
                const token = jwt.sign({ userId: adminId }, secretKey, { expiresIn: expiration });
                // req.session.adminToken = token;
                res.status(200).json({ message: 'Logged in successfully', token: token });
                // res.redirect('/admin')
            } else {
                res.status(400).json({ message: 'Invalid Password' });
                // res.render('login');
            }
        } else {
            res.status(400).json({ message: 'Invalid Email' });
            // res.render('login')

        }
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ status: 'error', message: 'An error occurred' });
    }
}

//CHANGE PASSWORD
const changeAdminPassword = async (req, res) => {
    try {
        const { email, oldPassword, newPassword } = req.body;
        const adminData = await Admin.findOne({ email: email });
        if (adminData) {
            const passwordMatch = await bcrypt.compare(oldPassword, adminData.password);
            if (passwordMatch) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(newPassword, salt);
                adminData.password = hashedPassword;
                await adminData.save();
                res.status(200).json({ message: 'Password changed successfully' });
            } else {
                res.status(400).json({ message: 'Invalid old password' });
            }
        } else {
            res.status(400).json({ message: 'Invalid email' });
        }
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ status: 'error', message: 'An error occurred' });
    }
}

//LOGOUT
const adminLogout = async (req, res) => {
    try {
        delete req.session.adminToken;
        // res.json({ status: 'success', message: 'Logged out successfully' });
        res.redirect('/admin')
    } catch (error) {
        // res.status(500).json({ status: 'error', message: 'An error occurred' });
        console.log(error.message);
    }
}

const loadUsers = async (req, res) => {
    try {
        const userData = await User.find();
        res.status(200).json(userData);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}



module.exports = {
    loadLogin,
    verifyAdmin,
    loadchangepassword,
    changeAdminPassword,
    adminLogout,
    loadUsers,
    loadDashboard
}