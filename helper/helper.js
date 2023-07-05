//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//IMPORT THINGS ON THE TOP
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const nodemailer = require("nodemailer");

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
let key = process.env.SecretKey;
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.encryptUsingAES256 = (data) => {
    let _key = CryptoJS.enc.Utf8.parse(key);
    let _iv = CryptoJS.enc.Utf8.parse(key);
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), _key, {
        keySize: 128,
        iv: _iv,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
}
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.decryptUsingAES256 = (data) => {
    let _key = CryptoJS.enc.Utf8.parse(key);
    let _iv = CryptoJS.enc.Utf8.parse(key);
    return CryptoJS.AES.decrypt(data, _key, {
        keySize: 128,
        iv: _iv,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8);
}
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.generateJwt = function(payload) {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    payload.exp = parseInt(expiry.getTime() / 1000);
    return jwt.sign(payload, process.env.JWT_SECRET);
}
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.transport = nodemailer.createTransport({
    host: process.env.EmailHost,
    port: process.env.EmailPort,
    secure: process.env.EmailSecure,
    auth: {
        user: process.env.EmailUser,
        pass: process.env.EmailPassword,
    },
});
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.generateOTP = function(e) {
    let otp = '';
    let digits = '0123456789';
    //++++++++++++++++++++++++++++++++++++++++++++++++
    for (let i = 0; i < e; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
}
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

