const express = require('express');
const sgMail = require('@sendgrid/mail');
const cors = require('cors');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// For development: Allow requests from localhost
if (process.env.NODE_ENV !== 'production') {
    app.use(cors({
        origin: 'http://localhost:3000'
    }));
} else {
    // For production: Allow requests only from your production domain
    app.use(cors({
        origin: 'https://hippsc-email-sender.vercel.app'  // replace with your actual production domain
    }));
}

// Your SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Parse JSON request bodies
app.use(express.json()); 

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
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
