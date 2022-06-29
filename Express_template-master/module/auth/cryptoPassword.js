// cryptoPassword.js
const crypto = require('crypto-promise');
const cryptoPassword = {};
const logger = require('../../config/winstonConfig');

// 랜덤 함수로 salt 생성 
cryptoPassword.salt = async () => {
    try {
        const saltBuffer = await crypto.randomBytes(64);
        const salt = saltBuffer.toString('base64');
        return salt;
    } catch (err) {
        logger.log('error', err.stack);
        res.status(200).json(response.failure(resMessage.INTERNAL_SERVER_ERROR));
    }
}

// 해쉬화된 패스워드 출력
cryptoPassword.hashedPassword = async (password, salt) => {
    try {
        const hashedPasswordBuffer = await crypto.pbkdf2(password, salt , 159203, 64, 'SHA512');
        const hashedPassword = hashedPasswordBuffer.toString('base64'); 
        return hashedPassword;  
    } catch (err) {
        logger.log('error', err.stack);
        res.status(200).json(response.failure(resMessage.INTERNAL_SERVER_ERROR));
    }
}

module.exports = cryptoPassword;