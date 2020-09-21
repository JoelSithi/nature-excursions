const path = require('path');
const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
//import the routers:
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewsRoutes');

const app = express();

// Setting up Pug in Express:
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1)  GLOBAL MIDDLEWARES:
// Serving static files:
app.use(express.static(`${__dirname}/public`));
// Setting Security HTTP Headers:
app.use(helmet());

//Using Morgan middleware = Development logging:
if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'));
}

// Limit requests from same APi = API Limiting:
const limiter = rateLimit({
  max: 100, 
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP. please try again in an hour'
});
app.use('/api', limiter);

//Using Express middleware = Body parser: reading data from the body into req.body:
app.use(express.json({ limit: '10kb' })); // : limiting the amount of data that comes in the body to 10kb
app.use(cookieParser());

// Data sanitization against NoSQL query objection:
app.use(mongoSanitize());

// Data sanitization against XSS:
app.use(xss());

// Preventing parameter pollution:
app.use(hpp({
  whitelist: ['duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price']
}));

//Creating date using middleware:
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  //console.log(req.headers);
  console.log(req.cookies);
  next();
});


//3) ROUTES

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);


// Handler for undefined routes:
app.all('*', (req, res, next) => {
  //res.status(404).json({
   // status: 'fail',
   // message: `Can't find ${req.originalUrl} on this server !`
  //});
  //const err = new Error(`Can't find ${req.originalUrl} on this server !`);
  //err.status = 'fail';
  //err.statusCode = 404;
  next(new AppError(`Can't find ${req.originalUrl} on this server !`, 404));
});


app.use(globalErrorHandler);

module.exports = app;
