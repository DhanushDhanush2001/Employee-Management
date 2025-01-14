const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
    },
    role: {
        type: String,
        default: 'admin'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Pre-save hook to hash the password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        next(error);  // Pass the error to the next middleware if hashing fails
    }
});

// Method to generate JWT token
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_TIME
    });
  };

// Method to compare entered password with hashed password in DB
userSchema.methods.isValidPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Create and export the model
const User = mongoose.model('User', userSchema);

module.exports = User;
