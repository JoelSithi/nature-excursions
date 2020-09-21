 
 const mongoose = require('mongoose');
 const dotenv = require('dotenv');

 // Handle uncaught exceptions:
 process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
 });

 dotenv.config({ path: './config.env' });
 const app = require('./app');
 
 

 const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
 
 //mongoose.connect(DB, {
 
  //useNewUrlParser: true
//})
 //.then(() => console.log('DB connection successful!'));

 
 mongoose.connect('mongodb+srv://joelDB:VXSTiWZn9N5GR5Vx@cluster0-vufv6.mongodb.net/natours', {
  useUnifiedTopology: true,
  useNewUrlParser: true
}).then(() => console.log('DB connection successful!'));
 


 //4) START SERVER:
 const port =  process.env.PORT || 3000;
 const server = app.listen(port, () => {
   console.log(` App running on port ${port}...`);
 });

//DATABASE_PASSWORD: VXSTiWZn9N5GR5Vx

// MacBook-Pro-de-joel:~ joelsithivong$ mongo "mongodb+srv://cluster0-vufv6.mongodb.net/test"  --username joelDB

// Handle unhandled rejections:
process.on('unhandledRejection', err => {
  console.log('UNHANDLER REJECTION! Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});




