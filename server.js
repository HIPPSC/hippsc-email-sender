const express = require('express');
const sgMail = require('@sendgrid/mail');
const cors = require('cors');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;


const corsOptions = {
    origin: 'http://localhost:3000', 
    methods: 'POST',
    allowedHeaders: ['Content-Type', 'Authorization']
};
  
app.use(cors(corsOptions));

// Your SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Parse JSON request bodies
app.use(express.json()); 


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

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
