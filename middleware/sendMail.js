

const axios = require('axios');
const ejs = require('ejs');
const fs = require('fs');

// Middleware function to send API request
const sendMail = (
    first_name,
    emp_id,
    email,
    password




) => {
    return new Promise((resolve, reject) => {
        // Set the SendinBlue API key
        const apiKey = process.env.EMAIL_API_KEY;

        // Set the SendinBlue API endpoint
        const apiUrl = process.env.EMAIL_API_URL;
        const template = fs.readFileSync('./public/login_details.ejs', 'utf-8');

        // Render the template with the user's login details
        const html = ejs.render(template, {
            first_name: first_name,
            emp_id: emp_id,
            password: password

        });

        // Create the request payload
        const payload = {
            sender: {
                name: "Mail from Gratia Technology",
                email: 'noreply@gratiatechnology.com'
            },
            to: [
                {
                    email: email,
                    name: first_name
                }
            ],
            subject: 'Login Details -Gratia',
            htmlContent: html
        };

        // Send the API request
        axios.post(apiUrl, payload, {
            headers: {
                'api-key': apiKey,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                // Handle successful response
                console.log('Email sent successfully!');
                resolve();
            })
            .catch(error => {
                // Handle error
                console.error('Error sending email:', error);
                reject(error);
            });
    });
};


module.exports = sendMail;
