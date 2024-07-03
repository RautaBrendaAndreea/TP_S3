import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    birthdate: {
        type: Date,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
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

const User = mongoose.model('User', userSchema);

export default User;