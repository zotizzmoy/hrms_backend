// Import necessary models
const UserModel = require("../models/Users");
const UserAttendance = require("../models/UsersAttendence");
const UserLeave = require("../models/UsersLeave");
const UserSalaryStructure = require("../models/UsersSalaryStructure");
// const UserSalary = require("../models/userSalary");



module.exports.addSalaryStructure = async (req, res) => {
  try {
    // Extract the data from the request body
    const {
      user_id,
      basic,
      hra,
      conveyance,
      special_allowance,
      gross_monthly_amount,
      bonus,
      performance_allowance,
      epf,
      esic,
      professional_tax,
      ctc_per_month,
      ctc_per_annum
    } = req.body;

    // Create a new user salary structure entry in the database
    const SalaryStructure = await UserSalaryStructure.create({
      user_id,
      basic,
      hra,
      conveyance,
      special_allowance,
      gross_monthly_amount,
      bonus,
      performance_allowance,
      epf,
      esic,
      professional_tax,
      ctc_per_month,
      ctc_per_annum,
      created_at: new Date(),
      updated_at: new Date()
    });

    // Return the newly created entry as the response
    res.status(201).json(SalaryStructure);
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error);
    res.status(500).json({ message: 'An error occurred while creating the salary structure.' });
  }
};



