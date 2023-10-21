const express = require('express');
const sgMail = require('@sendgrid/mail');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Serve static files from the React app
app.use(express.static('public'));

// Serve favicon
app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'favicon.ico'));
});


// cors options
const corsOptions = {
    origin: 'https://www.hippsc.com',
    methods: 'POST',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
  
// Enable cors
app.use(cors(corsOptions));

// Parse JSON request bodies
app.use(express.json()); 

// Home route
app.get('/', (req, res) => {
    res.send('Hello, this is my Express app!');
});


// Your SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);



// API limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100,
    message: "Too many requests from this IP. Please try again later."
});
app.use("/send-email", apiLimiter);


// Send email API
app.post('/send-email', async (req, res) => {
    const { formData } = req.body;

    const msg = {
        to: process.env.RECIPIENT,
        from: process.env.EMAIL_USER,
        subject: 'New Quote Request',
        text: JSON.stringify(formData, null, 2)
    };

    try {
        await sgMail.send(msg);
        res.status(200).send('Email sent');
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).send(`Internal Server Error: ${error.message}`);
    }
});

// app.listen(PORT, () => {
//     console.log(`Server started on port ${PORT}`);
// });
module.exports = app;
