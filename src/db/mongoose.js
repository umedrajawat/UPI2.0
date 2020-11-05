const mongoose = require('mongoose')
const nodemon = require('nodemon')

//Creating collecton named UPI-manager in mongoDb using mongoose
mongoose.connect('mongodb://127.0.0.1:27017/UPI-manager', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})
