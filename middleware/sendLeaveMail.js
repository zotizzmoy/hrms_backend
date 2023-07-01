const axios = require('axios');
const ejs = require('ejs');
const fs = require('fs');

// Middleware function to send API request
const sendLeaveMail = (
    first_name,
    last_name,
    emp_id,
    start_date,
    end_date,
    is_half_day,
    leave_type,
    reason
) => {
    return new Promise((resolve, reject) => {
        // Set the SendinBlue API key
        const apiKey = process.env.EMAIL_API_KEY;

        // Set the SendinBlue API endpoint
        const apiUrl = process.env.EMAIL_API_URL;
        const template = fs.readFileSync('./public/leave_apply.ejs', 'utf-8');

        // Render the template with the user's login details
        const html = ejs.render(template, {
            first_name: first_name,
            last_name: last_name,
            emp_id: emp_id,
            start_date: start_date,
            end_date: end_date,
            is_half_day: is_half_day,
            leave_type: leave_type,
            reason: reason
        });

        // Create the request payload
        const payload = {
            sender: {
                name: first_name,
                email: 'no-reply@gratia.com'
            },
            to: [
                {
                    email: 'hr@gratiatechnology.com',
                    name: 'Admin'
                }
            ],
            subject: 'Leave Application -Gratia',
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


module.exports = sendLeaveMail;
