const mongoose = require('mongoose');
 
 // Defined a database connection string

 const dbURI = 'mongodb://localhost/ZaraHealth';
 
// Opened a Mongoose connection at application startup

 mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true});


// Monitored the Mongoose connection events

 mongoose.connection.on('connected', () => {
   console.log(`Mongoose connected to ${dbURI}`);
 });
 mongoose.connection.on('error', err => {
   console.log('Mongoose connection error:', err);
 });
 mongoose.connection.on('disconnected', () => {
   console.log('Mongoose disconnected');
 });


const openingTimeSchema = new mongoose.Schema({
    days: { type: String, required: true },
    opening: String,
    closing: String,
    closed: {
        type: Boolean,
        required: true
    }
});

// Monitored some Node process events so that we can close the Mongoose connection when the application ends


 const gracefulShutdown = (msg, callback) => {
   mongoose.connection.close( () => {
     console.log(`Mongoose disconnected through ${msg}`);
     callback();
   });
 };

 // For nodemon restarts
 process.once('SIGUSR2', () => {
   gracefulShutdown('nodemon restart', () => {
     process.kill(process.pid, 'SIGUSR2');
   });
 });

 // For app termination
 process.on('SIGINT', () => {
   gracefulShutdown('app termination', () => {
     process.exit(0);
   });
 });

 // For Heroku app termination
 process.on('SIGTERM', () => {
   gracefulShutdown('Heroku app shutdown', () => {
     process.exit(0);
   });
 });