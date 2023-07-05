//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//IMPORT THINGS ON THE TOP
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const generator = require('generate-password');
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const {
    body,
    validationResult
} = require('express-validator');
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Helper
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const helper = require('../helper/helper.js');
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Model
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const UserModel = require('../models/Users');
const { generateJwt } = require("../helper/helper.js");
const sendMail = require("../middleware/sendMail.js");
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Route OTP
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.otp = async function (req, res) {
    let resData = {
        status: false,
        data: {},
        message: ''
    }
    try {
        //+++++++++++++++++++++++++++++++++++++++++++++++++++
        let phone_number = parseInt(req.body.phone_number, 10) || '';
        let phone_no_country_code = '+91';
        //+++++++++++++++++++++++++++++++++++++++++++++++++++
        if (!phone_number) {
            resData.message = 'Please Enter Phone Number';
            return res.status(200).json(resData);
        }
        if (phone_number.toString().length > 10) {
            resData.message = 'Phone Number Cant Be More Then 10 Character';
            return res.status(200).json(resData);
        }
        if (!phone_no_country_code) {
            resData.message = 'Please Enter Phone Number Country Code';
            return res.status(200).json(resData);
        }
        //+++++++++++++++++++++++++++++++++++++++++++++++++++
        let otp = helper.generateOTP(4);
        //+++++++++++++++++++++++++++++++++++++++++++++++++++
        const return_q_promis = UserModel.count({
            where: {
                phone_no: phone_number,
            }
        });
        //+++++++++++++++++++++++++++++++++++++++++
        return_q_promis.then((r_obj) => {
            if (r_obj == 0) {
                //+++++++++++++++++++++++++++++++++++++++++
                resData.status = true;
                resData.message = 'The Number Is not Register';
                return res.status(200).json(resData);
            } else {
                //+++++++++++++++++++++++++++++++++++++++++
                const return_q_promis_2 = UserModel.findAndCountAll({
                    where: {
                        phone_no: phone_number,
                    }
                });
                //+++++++++++++++++++++++++++++++++++++++++
                return_q_promis_2.then((r_obj) => {
                    //+++++++++++++++++++++++++++++++++++++++++
                    let main_data = {
                        password: helper.encryptUsingAES256(otp),
                    };
                    //+++++++++++++++++++++++++++++++++++++++++
                    UserModel.update(main_data, {
                        where: {
                            id: r_obj.rows[0].id
                        }
                    }).then(obj => {
                        //+++++++++++++++++++++++++++++++++++++++++
                        //resData.data.data_processing = r_obj.rows;
                        resData.data.otp = otp;
                        //+++++++++++++++++++++++++++++++++++++++++
                        resData.status = true;
                        resData.message = 'OTP Send To Your Register Phone Number';
                        return res.status(200).json(resData);
                    }).catch(obj_error => {
                        //+++++++++++++++++++++++++++++++++++++++++
                        resData.status = false;
                        resData.data.data_processing = obj_error;
                        resData.message = 'Sorry!! Something Went Wrong. Please Try After Sometime.';
                        return res.status(200).json(resData);
                    });
                }).catch(obj_error => {
                    //+++++++++++++++++++++++++++++++++++++++++
                    resData.status = false;
                    resData.data.data_processing = obj_error;
                    resData.message = 'Sorry!! Something Went Wrong. Please Try After Sometime.';
                    return res.status(200).json(resData);
                });
            }
        });
        //+++++++++++++++++++++++++++++++++++++++++
    } catch (e) {
        resData.status = false;
        resData.message = 'Error!!';
        resData.data = e;
        res.status(601).json(resData);
    }
}
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Route Resnd OTP
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.resend_opt = async function (req, res) {
    let resData = {
        status: false,
        data: {},
        message: ''
    }
    try {
        //+++++++++++++++++++++++++++++++++++++++++++++++++++
        let phone_number = parseInt(req.body.phone_number, 10) || '';
        //+++++++++++++++++++++++++++++++++++++++++++++++++++
        if (!phone_number) {
            resData.message = 'Please Enter Phone Number';
            return res.status(200).json(resData);
        }
        if (phone_number.toString().length > 10) {
            resData.message = 'Phone Number Cant Be More Then 10 Character';
            return res.status(200).json(resData);
        }
        //+++++++++++++++++++++++++++++++++++++++++++++++++++
        let otp = helper.generateOTP(4);
        //+++++++++++++++++++++++++++++++++++++++++++++++++++
        const return_q_promis = UserModel.count({
            where: {
                phone_no: phone_number,
            }
        });
        //+++++++++++++++++++++++++++++++++++++++++
        return_q_promis.then((r_obj) => {
            if (r_obj == 1) {
                //+++++++++++++++++++++++++++++++++++++++++
                let main_data = {
                    password: helper.encryptUsingAES256(otp),
                };
                UserModel.update(main_data, {
                    where: {
                        phone_no: phone_number
                    }
                }).then(obj => {
                    //+++++++++++++++++++++++++++++++++++++++++
                    resData.data.otp = otp;
                    //resData.data.data_processing = obj;
                    //+++++++++++++++++++++++++++++++++++++++++
                    resData.status = true;
                    resData.message = 'New OTP Send To Your Register Phone Number';
                    return res.status(200).json(resData);
                }).catch(obj_error => {
                    //+++++++++++++++++++++++++++++++++++++++++
                    resData.status = false;
                    resData.data.data_processing = obj_error;
                    resData.message = 'Sorry!! Something Went Wrong. Please Try After Sometime.';
                    return res.status(200).json(resData);
                });
            } else {
                resData.status = false;
                resData.message = 'Not Valied User';
                return res.status(200).json(resData);
            }
        });
        //+++++++++++++++++++++++++++++++++++++++++
    } catch (e) {
        resData.status = false;
        resData.message = 'Error!!';
        resData.data = e;
        res.status(601).json(resData);
    }
}
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Route Login
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.login = async function (req, res) {
    try {
        const { emp_id, password } = req.body;

        // Check if user exists
        const user = await UserModel.findOne({ where: { emp_id } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create and send JWT token
        const payload = {
            user_id: user.id,
            emp_id: user.emp_id,
            first_name: user.first_name,
            last_name: user.last_name,
            gender: user.gender,
            dob: user.dob,
            religion: user.religion,
            email: user.email,
            user_image: user.user_image,
            contact_no: user.contact_no,
            designation: user.designation,
            role: user.role,
            status: user.status,
            guardian_name: user.guardian_name
        }

        helper.generateJwt(payload)

        const data = await UserModel.findOne({ where: { emp_id } })


        res.status(200).json({ token: helper.generateJwt(payload), user: data });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }


};

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Route Register
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


module.exports.register = async function (req, res) {


    const user = await UserModel.findOne({ where: { email: req.body.email } });
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);

    const autoPassword = generator.generate({
        length: 6,
        numbers: true
    });

    if (!user) {
        const userObject = {

            emp_id: req.body.emp_id,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            contact_no: req.body.contact_no,
            designation: req.body.designation,
            address: req.body.address,
            password: bcrypt.hashSync(autoPassword, salt),
            status: "Active",
            role: 0,
            guardian_name: req.body.guardian_name,
            dob: req.body.dob,
            gender: req.body.gender,
            religion: req.body.religion,
            leave_balance: req.body.leave_balance

        }

        const user = await UserModel.create(userObject);


        res.status(201).json({
            message: "User successfully registered"
        });

        await sendMail(user.first_name, user.emp_id, user.email, autoPassword);

    } else {
        res.status(400).json({ error: "User already exists" });
    }


};



module.exports.update = async function (req, res) {
    try {

        const userObject = {
            emp_id:req.body.emp_id,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            guardian_name: req.body.guardian_name,
            religion: req.body.religion,
            address: req.body.address,
            dob: req.body.dob,
            contact_no: req.body.contact_no,
            designation: req.body.designation,

        }
        created_user = await UserModel.update(userObject, { where: { id: req.body.id } });
        res.status(200).json({
            user: await UserModel.findOne({ where: { id: req.body.id } })
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
};

module.exports.profileImage = async function (req, res, err) {
    try {

     const update = {
            user_image: req.file.filename
        }
        created_user = await UserModel.update(update, { where: { emp_id: req.body.emp_id } });
        res.status(200).json({
            data: await UserModel.findOne({ where: { emp_id: req.body.emp_id } })
        });

    } catch (error) {
        res.status(422).json({
            error: error.message
        })

    }
};

module.exports.user_image = async (req, res) => {
    try {
        const user = await UserModel.findOne({
            attributes: ['user_image'],
            where: { emp_id: req.body.emp_id }
        });
        res.status(200).json({
            data: user
        });

    } catch (error) {
        res.status(400).json({
            error: error.message
        })


    }
};

module.exports.change_password = async (req, res) => {
    try {

        const password = req.body.password;
        if (!password) {
            return res.status(422).json({
                error: "enter password"
            })
        }

        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);

        const update = {
            password: bcrypt.hashSync(password, salt)
        }
        created_user = await UserModel.update(update, { where: { emp_id: req.body.emp_id } });
        res.status(200).json({
            message: "Password Changed Successfully"
        });

    } catch (error) {
        res.status(400).json({
            error: error.message
        })

    }
};