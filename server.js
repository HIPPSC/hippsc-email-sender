const express = require('express');
const cors = require('cors');
const path = require('path');
const nodemailer = require('nodemailer');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// enable trust proxy
app.set('trust proxy', true);

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

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    host: "smtp.exmail.qq.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

// Send email API
app.post('/send-email', async (req, res) => {
    const { formData } = req.body;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.RECIPIENT,
        subject: 'New Quote Request',
        text: JSON.stringify(formData, null, 2)
    };

    try {
        await transporter.sendMail(mailOptions);
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
