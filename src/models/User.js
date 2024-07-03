import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const { Schema } = mongoose;

const userSchema = new Schema({
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true
    },
    firstname: {
        type: String,
        required: true,
        maxlength: 50
    },
    lastname: {
        type: String,
        required: true,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Le format est invalid']
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    phone: {
        type: String,
        required: true,
        match: [/^\+?\d{10,15}$/, 'Le format est invalid']
    },
    birthdate: {
        type: Date,
        required: true
    },
    city: {
        type: String,
        required: true,
        maxlength: 100
    },
    country: {
        type: String,
        required: true,
        maxlength: 100
    },
    photo: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['Marketing', 'Client', 'Technique'],
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true 
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

const User = mongoose.model('User', userSchema);

export default User;
