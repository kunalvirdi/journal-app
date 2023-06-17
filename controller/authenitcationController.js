const User = require('../model/users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Teacher = require("../model/teachers");
const Student = require("../model/students");
require('dotenv').config();


module.exports.register = async (req, res) => {

    //Password encryption using bcrypt
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user_id = req.body.id, username = req.body.username, role = req.body.role, email = req.body.email;

    //Adding new user to user table and corresponds role table
    const user = new User(user_id, username, hashedPassword, role, email);
    await user.save();
    if (req.body.role === "teacher") {
        const teacher = new Teacher(user_id, username, email);
        await teacher.save();
    } else {
        const student = new Student(user_id, username, email);
        await student.save();
    }
    res.status(201).json({message: `Registered ${username} as ${role}`})
}

module.exports.login = async (req, res) => {
    //Getting details from user table and authenticate using bcrypt.
    const [data] = await User.findUser(req.body.username);
    if (data.length !== 0) {
        const isAuthenticated = await bcrypt.compare(req.body.password, data[0].password);
        if (!isAuthenticated) {
            res.status(404).json({message: "Incorrect Password..."});
        } else {
            const userData = {
                userId: data[0].user_id,
                username: data[0].username,
                role: data[0].role,
                email: data[0].email
            };

            // Sending JWT token for future authorization
            const token = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET);
            res.status(200).json({message: `Login ${data[0].username} as ${data[0].role}`, token})
        }
    }else{
        res.status(404).json({message: "User didn't found..."});
    }

}
