// auth.js
const bcrypt = require('bcrypt');
const collection = require("./config");

async function signup(data) {
    // Check if username exists
    const existingUser = await collection.findOne({ username: data.username });
    if (existingUser) {
        return "Username already exists";
    }

    // Check if email exists
    const existingEmail = await collection.findOne({ email: data.email });
    if (existingEmail) {
        return "Email already exists";
    }

    // Check if phone number exists
    const existingPhone = await collection.findOne({ phone: data.phone });
    if (existingPhone) {
        return "Phone number already exists";
    }

    // Hash password
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(data.password, saltRounds);
    data.password = hashPassword;

    // Insert user data into the database
    await collection.insertMany(data);
    return "User registered successfully";
}

async function login(username, password) {
    try {
        const user = await collection.findOne({ username });
        if (!user) {
            return "User not found";
        }
        const isPassword = await bcrypt.compare(password, user.password);
        if (isPassword) {
            return {success:true,redirectTo:'../views/home'};//views\home.ejs
        } else {
            return "Wrong password";
        }
    } catch (error) {
        console.error(error);
        return "An error occurred";
    }
}

module.exports = { signup, login };
