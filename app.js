const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const layouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const router = express.Router();
const axios = require("axios");
// if (config.env) ? require("dotenv").config({path: "config.env"});
require("dotenv").config({path: "config.env"}); // dotenv -> npm install dotenv


const categoryRouter = require("./Router/CategoryRouter");
const blogsRouter = require("./Router/BlogsRouter");
const ViewRouter = require("./Router/ViewRouter");
const AuthRouter = require("./Router/AuthRouter");
const userModel = require("./Model/UserModel");
const AdminRouter = require("./Router/AdminRouter");






try {
    mongoose.connect("mongodb://localhost:27017" );
    console.log("Database Connected Succssfully");
} catch (err) {
    console.log("Error Occured");
}

console.log(process.env.CONNCTION_STRING)

const app = express();

// Default Middleware (Provided by Express)

// used to Block third party ip address 
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// ejs --> Nodejs Enviroment Compiles --> append content --> Render in browser


// setting up the view engine
app.set('view engine', "ejs");

// giving the absolute path of the views where the DOM content(.ejs files) are located 
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// express.static(path.join(__dirname, ))
app.use(layouts);
app.set("layout", "Layouts");

// accepts data from the req.body incomming or sending from the POST request
app.use(express.json());
// ---> incomming -> binary ---> json

// Routes
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/blogs", blogsRouter);
app.use("/api/v1/auth", AuthRouter);

app.use("/", ViewRouter);
// localhost:8001/hello-world
// app.use("prefix", Router_Path);

app.set("layout", "Layouts")

app.use("/admin", AdminRouter);

// Example route
router.get('/', (req, res) => {
    res.send('Cart Route Working!');
});


// 404 not found
app.get("*", (req, res) => {
    res.render("NotFound/NotFound");
});

// seeding the admin
(async () => {
    try {
        await userModel.create({
            email: process.env.ADMIN_EMAIL,
            password: await bcrypt.hash( 8),
           
        });

        console.log("Admin Seeded Successfully");
    } catch (err) {
        console.log(err)
    }

});


// API Route to handle form submission
app.post("/submit-enquiry", async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const newEnquiry = new Enquiry({ name, email, message });
        await newEnquiry.save();
        res.json({ message: "Enquiry submitted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error submitting enquiry", error });
    }
});




// API Route to handle form submission
//singup 
// API endpoint to send verification code
app.post('/api/signup/send-code', async (req, res) => {
    const { method, phone } = req.body;

    // Basic phone number validation
    if (!phone || !/^\d+$/.test(phone)) {
        return res.status(400).json({ success: false, message: 'Invalid phone number.' });
    }

    // Check if the phone number already exists in your database
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
        return res.status(409).json({ success: false, message: 'Phone number already registered.' });
    }

    const verificationCode = generateVerificationCode(); // Implement your code generation logic

    if (method === 'whatsapp') {
        // Implement logic to send verification code via WhatsApp (using a WhatsApp API service)
        const whatsappResult = await sendWhatsAppMessage(phone, `Your verification code is: ${verificationCode}`);
        if (whatsappResult.success) {
            // Store the verification code and phone number in your database (with an expiry time)
            await saveVerificationData(phone, verificationCode, 'whatsapp');
            res.json({ success: true });
        } else {
            res.status(500).json({ success: false, message: `Failed to send WhatsApp code: ${whatsappResult.error}` });
        }
    } else if (method === 'sms') {
        // Implement logic to send verification code via SMS (using an SMS API service)
        const smsResult = await sendSMSMessage(phone, `Your verification code is: ${verificationCode}`);
        if (smsResult.success) {
            // Store the verification code and phone number in your database (with an expiry time)
            await saveVerificationData(phone, verificationCode, 'sms');
            res.json({ success: true });
        } else {
            res.status(500).json({ success: false, message: `Failed to send SMS code: ${smsResult.error}` });
        }
    } else {
        res.status(400).json({ success: false, message: 'Invalid verification method.' });
    }
});

// API endpoint to verify the code and create a new user
app.post('/api/signup/verify-code', async (req, res) => {
    const { phone, code } = req.body;

    // Retrieve the stored verification data from the database
    const verificationRecord = await Verification.findOne({ phone, code, expiresAt: { $gt: new Date() } });

    if (verificationRecord) {
        // Create a new user in your database
        const newUser = new User({ phone });
        await newUser.save();

        // Optionally delete the verification record
        await Verification.deleteOne({ _id: verificationRecord._id });

        res.json({ success: true, message: 'Account created successfully.' });
    } else {
        res.status(400).json({ success: false, message: 'Invalid or expired verification code.' });
    }
});

// Google OAuth routes (you'll need to configure Passport.js or a similar library)
app.get('/auth/google', /* Google OAuth handler */);
app.get('/auth/google/callback', /* Google OAuth callback handler */);

// Facebook OAuth routes (you'll need to configure Passport.js or a similar library)
app.get('/auth/facebook', /* Facebook OAuth handler */);
app.get('/auth/facebook/callback', /* Facebook OAuth callback handler */);

// Helper functions (implement these)
function generateVerificationCode() {
    // Generate a random verification code (e.g., 6 digits)
    return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendWhatsAppMessage(phone, message) {
    // Implement integration with a WhatsApp API provider (e.g., Twilio, Gupshup)
    // This will involve using their SDK or making HTTP requests to their API
    console.log(`Sending WhatsApp to ${phone}: ${message}`);
    // Return an object like { success: true } or { success: false, error: '...' }
    return { success: false, error: 'WhatsApp API integration not implemented' };
}

async function sendSMSMessage(phone, message) {
    // Implement integration with an SMS API provider (e.g., Twilio, Nexmo)
    // This
    console.log(`Sending SMS to ${phone}: ${message}`);
    // Return an object like { success: true } or { success: false, error: '...' }
    return { success: false, error: 'SMS API integration not implemented' };
}

//enquire
app.post('/api/enquire', async (req, res) => {
    // Your code to handle the incoming enquiry data,
    // save it to MongoDB, and send a response.
    try {
        const newEnquiry = new Enquiry(req.body);
        const savedEnquiry = await newEnquiry.save();
        res.json({ message: 'Enquiry submitted successfully!', data: savedEnquiry });
    } catch (error) {
        console.error('Error saving enquiry:', error);
        res.status(500).json({ error: 'Failed to submit enquiry.' });
    }
});






// localhost:8001/api/v1/blogs/upload-blogs
// Address = localhost:8001/
// Prefix = /api/v1/blogs/ 
// Endpoints = upload-blogs

app.listen(3001, function () {
    console.log(`Server is running at port localhost`);
});