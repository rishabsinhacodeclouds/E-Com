require('dotenv').config();

const User = require('../models/userModel');
const Products = require('../models/productModel');

const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error) {
        console.log(error.message);
    }
}


const verifyRegister = async (req, res) => {
    try {
        const { name, email, mobileNumber, password } = req.body;
        const userData = await User.findOne({ $or: [{ mobileNumber: { $in: [mobileNumber] } }, { email: { $in: [email] } }] });

        if (userData) {
            if (userData.email == email) {
                res.json({ message: 'Email already exists' })
            } else {
                res.json({ message: 'Mobile Number already exists' })
            }
        } else {
            const bcryptPassword = await securePassword(password);
            const user = new User({
                userName: name,
                email: email,
                mobileNumber: mobileNumber,
                password: bcryptPassword,
            });

            await user.save()
                .then(() => {
                    const secretKey = process.env.TOKEN_SECRET_KEY;
                    const expiration = 10000;
                    const userId = user._id;
                    const token = jwt.sign({ userId: userId }, secretKey, { expiresIn: expiration });
                    res.json({ success: true, token: token, userName: name, userId: user._id })
                })
        }
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Internal Server Error' })
    }
}


const verifyLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userData = await User.findOne({ email: email });

        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password)
            if (passwordMatch) {
                const secretKey = process.env.TOKEN_SECRET_KEY;
                const expiration = 10000;
                const userId = userData._id;
                const token = jwt.sign({ userId: userId }, secretKey, { expiresIn: expiration });
                res.json({ success: true, token: token, userName: userData.userName, userId: userData._id })
            } else {
                res.json({ message: "Incorrect Password" })
            }
        }
        else {
            res.json({ message: "Incorrect Email" })
        }
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Internal Server Error' })
    }
}


module.exports = {
    verifyRegister,
    verifyLogin
}