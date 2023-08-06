const mongoose = require('mongoose');
const host = '127.0.0.1'
const dbURI = 'mongodb://127.0.0.1/travlr';
const readLine = require('readline');

//avoid 'current server discovery and monitoring enginer is deprecated'
//mongoose.set('useUnifiedTopology', true);
mongoose.set('debug', true);

const connect = () => {
    setTimeout(() => mongoose.connect(dbURI, {
        //useNewUrlParser: true,
        //useCreateIndex: true
    }), 1000);
}



mongoose.createConnection('connected', () => {
    console.log(`Mongoose connected to ${dbURI}`); 
});

mongoose.createConnection('error', err => {
    console.log('Mongoose connection error:', err);
});

mongoose.createConnection('disconnected', () => {
    console.log('Mongoose disconnected');
});

if (process.platform === 'win32'){
    const rl = readLine.createInterface ({
        input: process.stdin,
        output: process.stdout
      });
      rl.on ('SIGINT', () => {
        process.emit ("SIGINT");
      });
}

const gracefulShutdown = (msg, callback) => {
    mongoose.connection.close( () => {                         2
        console.log(`Mongoose disconnected through ${msg}`);     3
        callback();                                              3
      });
};

//for nodemon restarts
process.once('SIGUSR2', () => {
    gracefulShutdown('nodemon restart', () => {          2
        process.kill(process.pid, 'SIGUSR2');              2
      });
});

//for app termination
process.on('SIGINT', () => {
    gracefulShutdown('app termination', () => {          4
        process.exit(0);                                   4
      });
});

//for heroku app termination
process.on('SIGTERM', () => {
    gracefulShutdown('Heroku app shutdown', () => {      6
        process.exit(0);                                   6
      });
});

connect();

//bring in the mongoose schema
require('./travlr');