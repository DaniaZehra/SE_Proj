import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const requireAuth = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: 'Authorization required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};


export default requireAuth;