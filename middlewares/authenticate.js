import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import dotenv from 'dotenv';

dotenv.config();

const authenticate = async (req, res, next) => {
    const { authorization } = req.headers;
            
    if (!authorization) {
        return res.status(401).json({ error: "Authorization token required" });
    }
    try {
        const token = authorization.split(' ')[1];
        if (!token) return res.status(401).json({ error: 'You must be logged in' })
        // console.log(token)
        const { id } = jwt.verify(token, process.env.JWT_SECRET);
        console.log(id)
        if (!id) return res.status(401).json({ error: 'Unauthorized User' })


        const user = await User.findById(id)
        req.user = user
        next()

    } catch (error) {
        console.log(error)
        return res.status(401).json({ error: "Authorization failed" });
    }
};

export default authenticate;