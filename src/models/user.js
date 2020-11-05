const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    accountNumber: {
        type: Number,
        default: 0,
        unique:true,
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    Balance:{
        type:Number,
        default:0

    },
    avgBalance:{
        type:Number,
        default:0
    },
    creditlimit:{
        type:Number,
        default:0

    },
    
}, {
    timestamps: true
})


userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}
userSchema.methods.generateAccountNumber=async function () {
    const user=this
    const accountNo = Math.floor(10000000 + Math.random() * 90000000);
    console.log("account no",accountNo);
    user.accountNumber=accountNo;
    await user.save();
    return user;
    
}
userSchema.methods.setAccountDetails=async function(avg,limit){
    const user=this;
    const average=avg;
    console.log('avg',average);
    const creditLimit=limit;
    console.log('limit',limit)
    user.avgBalance=average;
    user.creditlimit=creditLimit
    await user.save();
    return user;
}

userSchema.methods.setBalance = async function(data){
    const user=this;
    const balance=data;
    user.Balance=balance;
    await user.save()
    return user;
   
}
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse')

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const User = mongoose.model('Users', userSchema)

module.exports = User