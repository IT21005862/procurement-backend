import { Router } from "express";
import User from "../models/User.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

const router = Router();

const sendVerificationEmail = async (email, verificationToken) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "ravishkadulshan1@gmail.com",
            pass: "fqjvbzsdhfvutmnh",
        },
    });

    const mailOptions = {
        from: "amazon.com",
        to: email,
        subject: "Email verification",
        text: `Please click the following link to verify your email : http://localhost:8080/api/verify/${verificationToken}`,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log("Error sending verification email", error);
    }
};

const generateSecretKey = () => {
    const secretKey = crypto.randomBytes(32).toString("hex");
    return secretKey;
};

const secretKey = generateSecretKey();

router.post("/register", async (req, res) => {
    try {
        const { name, email, password, itemTypes, addresses } = req.body;
        const existingUser = await User.findOne({ email });
        
        if (existingUser) {
            return res.status(400).json({ message: "User already registered" });
        }
        
        const newUser = new User({ name, email, password, itemTypes, addresses });
        newUser.verificationToken = crypto.randomBytes(20).toString("hex");
        await newUser.save();

        sendVerificationEmail(newUser.email, newUser.verificationToken);
    } catch (error) {
        console.log("Error registering User", error);
        res.status(500).json({ message: "Registration failed" });
    }
});

router.post("/getUser", async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
        res.status(401).json({ error: true, message: "user is not there" });
    else if (user) {
        res.status(200).json({
            error: false,
            username: user.userName,
            messaage: "User is there",
        });
    }
});

// router.post("/get-user-details", async (req, res) => {

//     const user = await User.findOne({ userName: req.body.username });
//     if (!user) res.status(401).json({ error: true, message: "user is not there" });
//     else if(user){
//         res.status(200).json({
//             error: false,
//             username: user.userName,
//             email: user.email,
//             messaage: "User is there",
//         });
//     }
// })

// router.post("/checkStatus", async (req, res) => {

//     const token = await UserToken.findOne({ token: req.body.refreshToken });
//     if (!token) res.status(401).json({ error: true, loggedIn: false, message: "user is not logged in" });
//     else if(token){
//         res.status(200).json({
//             error: false,
//             loggedIn: true,
//             messaage: "User is logged in",
//         });
//     }
// })

// login

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res
                .status(404)
                .json({ message: "Invalid email or password" });
        }

        if (user.password !== password) {
            return res.status(500).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ userId: user._id }, secretKey);
        res.status(200).json({ token: token });
    } catch (error) {
        res.status(500).json({ message: "Login Failed" });
    }
});

router.get("/verify/:token", async (req, res) => {
    try {
        const token = req.params.token;

        const user = await User.findOne({ verificationToken: token });
        if (!user) {
            return res
                .status(404)
                .json({ message: "Invalid Verification Token" });
        }
        user.verified = true;
        user.verificationToken = undefined;

        await user.save();
        res.status(200).json({ message: "Email verified" });
    } catch (error) {
        res.status(500).json({ message: "Email verification failed" });
    }
});

export default router;
