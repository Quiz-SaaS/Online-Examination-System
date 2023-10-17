const PORT = process.env.PORT || 5000;
const createError = require('http-errors');
const express = require('express');
const helmet = require('helmet');
const path = require('path');
const logger = require('morgan');
const expressValidator = require('express-validator');
const passport = require('./services/passportconf');
const app = express();

// middlewares
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

// routes
const adminRouter = require('./routes/admin');
const loginRouter = require('./routes/login');
const userRouter = require('./routes/user');
const universalRouter = require('./routes/universal');
const questionRouter = require('./routes/questions');
const testpaperRouter = require('./routes/testpaper');
const upRouter = require('./routes/fileUpload');
const traineeRouter = require('./routes/trainee');
const stopRegistrationRouter = require('./routes/stopRegistration');
const resultsRouter = require('./routes/results');
const dummyRouter = require('./routes/dummy');

app.use('/api/v1/admin', passport.authenticate('user-token', { session: false }), adminRouter);
app.use('/api/v1/user', passport.authenticate('user-token', { session: false }), userRouter);
app.use('/api/v1/subject', passport.authenticate('user-token', { session: false }), universalRouter);
app.use('/api/v1/questions', passport.authenticate('user-token', { session: false }), questionRouter);
app.use('/api/v1/test', passport.authenticate('user-token', { session: false }), testpaperRouter);
app.use('/api/v1/upload', passport.authenticate('user-token', { session: false }), upRouter);
app.use('/api/v1/trainer', passport.authenticate('user-token', { session: false }), stopRegistrationRouter);
app.use('/api/v1/trainee', traineeRouter);
app.use('/api/v1/final', resultsRouter);
app.use('/api/v1/lala', dummyRouter);
app.use('/api/v1/login', loginRouter);

// catch-all route
app.use('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

// error handling
app.use((req, res, next) => next(createError(404, 'Invalid API. Use the official documentation to get the list of valid APIs.')));
app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message,
    });
});

app.listen(PORT, (err) => {
    if (err) {
        console.log(err);
    }
    console.log(`Server Started. Server listening to port ${PORT}`);
});