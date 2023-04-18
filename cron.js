const cron = require('node-cron');
const mongoose = require('mongoose');
require('dotenv').config();

const url = process.env.MONGO_URL;

// Schedule the task to run every day at midnight
cron.schedule('0 0 * * *', () => {
    console.log('Running cron job...');

    // Connect to the database
    mongoose.connect(url, (err, db) => {
        if (err) throw err;

        console.log('Connected to database!');

        // Do something with the database here...

        db.close();
        console.log('Disconnected from database.');
    });
});