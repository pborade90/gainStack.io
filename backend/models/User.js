import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    profile: {
        name: String,
        age: Number,
        weight: Number,
        height: Number,
        fitnessLevel: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced'],
            default: 'beginner'
        }
    }
}, {
    timestamps: true
});

// Static signup method
userSchema.statics.signup = async function(email, password) {
    if (!email || !password) {
        throw new Error('All fields are required');
    }

    if (!validator.isEmail(email)) {
        throw new Error('Email is not valid');
    }

    if (!validator.isStrongPassword(password)) {
        throw new Error('Password not strong enough');
    }

    const exists = await this.findOne({ email });
    if (exists) {
        throw new Error('Email already in use');
    }

    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, salt);

    const user = await this.create({ email, password: hash });
    return user;
};

// Static login method
userSchema.statics.login = async function(email, password) {
    if (!email || !password) {
        throw new Error('All fields are required');
    }

    const user = await this.findOne({ email });
    if (!user) {
        throw new Error('Incorrect email');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw new Error('Incorrect password');
    }

    return user;
};

export default mongoose.model('User', userSchema);