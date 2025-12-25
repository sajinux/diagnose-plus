// Authentication Configuration
require('dotenv').config();

module.exports = {
    jwt: {
        secret: process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production',
        expiresIn: process.env.JWT_EXPIRES_IN || '15m',
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'your_super_secret_refresh_key_change_this_in_production',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
    },
    bcrypt: {
        saltRounds: 10
    },
    rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 5 // limit each IP to 5 requests per windowMs
    }
};
