import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const requireAuth = async (req, res, next) => {
    console.log('🔐 Auth Middleware - Checking authorization header...')

    // verify authentication
    const { authorization } = req.headers

    if (!authorization) {
        console.log('❌ No authorization header')
        return res.status(401).json({ error: "Authentication token required" })
    }

    // Check if it's in the correct format
    if (!authorization.startsWith('Bearer ')) {
        console.log('❌ Invalid authorization format')
        return res.status(401).json({ error: "Invalid authorization format" })
    }

    const token = authorization.split(' ')[1]
    console.log('📝 Token received:', token ? 'Present' : 'Missing')

    try {
        console.log('🔍 Verifying JWT token...')
        const { _id } = jwt.verify(token, process.env.JWT_SECRET)
        console.log('✅ Token verified, user ID:', _id)

        const user = await User.findOne({ _id }).select('_id')
        if (!user) {
            console.log('❌ User not found in database')
            return res.status(401).json({ error: "User not found" })
        }

        req.user = user
        console.log('✅ User authenticated successfully')
        next()
    } catch (error) {
        console.log('❌ JWT verification failed:', error.message)
        return res.status(401).json({ error: "Request is not authorized" })
    }
}

export default requireAuth