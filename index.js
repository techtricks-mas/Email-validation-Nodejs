require('dotenv').config()
const express = require('express')
const cors = require('cors')
const dbConnect = require('./db/db')
const userModel = require('./model/userModel')
const sendEmail = require('./helper/emailVerificationMail')
const jwt = require('jsonwebtoken');
const app = express()

// Cors Use
app.use(cors())
app.use(express.json())

// DB Connect
dbConnect()

app.post('/', async function (req, res) {
    try {
        // Get Body Parameters
        let { email } = req.body

        // UserModel
        const user = new userModel ({
            email: email
        })
        // Validate
        try {
            await user.validate();
        } catch (error) {
            let errors = {};

            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });

            return res.status(400).send(errors);
        }
        // Save Data
        try {
            user.save();
        } catch (error) {
            return res.status(400).send(error);
        }
        // Settings for mail
        const privateKey = process.env.PRIVATE_KEY
        const token = jwt.sign({ email: email }, privateKey);
        const url = `http://localhost:8000/verify?token=${token}`
        sendEmail(email, url)

        // Response send
        res.send('Verify your email')
    } catch (error) {
        return res.status(400).send(error);
    }
    
})
app.get('/verify', async function (req, res) {
    // Get Query Parameters
    let {token} = req.query
    
    // Settings for mail
    const privateKey = process.env.PRIVATE_KEY
    var decoded = jwt.verify(token, privateKey);

    // Check Mail to Verify
    const check = await userModel.find({ email: decoded.email }).exec();

    // Verify
    await userModel.findByIdAndUpdate(check[0]._id, {
        varify: true
    })

    // Response send
    res.send('Email Verified')
})

// App listener
app.listen(process.env.PORT, function () {
    console.log(`App started at port: ${process.env.PORT}`)
})
