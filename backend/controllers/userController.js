import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const createToken = (_id) => {
    console.log('🛠️ Creating JWT token for user:', _id)
    const token = jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    console.log('✅ Token created successfully')
    return token
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);

        res.status(200).json({
            email: user.email,
            token,
            profile: user.profile
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const signupUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.signup(email, password);
        const token = createToken(user._id);

        res.status(201).json({
            email: user.email,
            token,
            profile: user.profile
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const updateProfile = async (req, res) => {
    const { profile } = req.body;

    try {
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { profile },
            { new: true, runValidators: true }
        ).select('email profile');

        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};