// Import necessary models
const UserModel = require("../models/Users");
const UserAttendance = require("../models/UsersAttendence");
const UserLeave = require("../models/UsersLeave");
const UserSalaryStructure = require("../models/UsersSalaryStructure");
// const UserSalary = require("../models/userSalary");

const axios = require('axios');

// const generateSalary = async (req, res) => {
//   try {
//     // Fetch all user salary structures from the database
//     const userSalaryStructures = await userSalaryStructure.findAll();

//     // Fetch all users from the database
//     const users = await userModel.findAll();

//     // Extract the necessary data from the request body
//     const { month } = req.body;

//     // Array to store the newly created salary records
//     const newSalaries = [];

//     // Fetch holidays from the external API
//     const response = await axios.get('https://api.example.com/holidays');
//     const holidays = response.data;

//     // Generate salary record for each user
//     for (const user of users) {
//       const userId = user.id;

//       // Find the corresponding user salary structure
//       const userSalaryStructure = userSalaryStructures.find(
//         (salaryStructure) => salaryStructure.user_id === userId
//       );

//       if (!userSalaryStructure) {
//         // If salary structure doesn't exist for the user, skip generating salary
//         continue;
//       }

//       // Extract necessary data from the user salary structure
//       const {
//         basic,
//         hra,
//         conveyance,
//         special_allowance: specialAllowance,
//       } = userSalaryStructure;

//       // Calculate the gross monthly amount
//       const grossMonthlyAmount =
//         basic + hra + conveyance + specialAllowance;

//       // Calculate the deductions for absent days and leaves
//       const userAttendances = await userAttendance.findAll({
//         where: { user_id: userId },
//       });

//       const userLeaves = await userLeave.findAll({
//         where: { user_id: userId },
//       });

//       const workingDays = userAttendances.length;
//       const leaves = userLeaves.length;

//       // Filter holidays for the current month
//       const holidaysInMonth = holidays.filter(
//         (holiday) => holiday.month === month
//       );

//       // Count the total number of holidays in the month
//       const holidayCount = holidaysInMonth.length;

//       // Add holidays and Sundays to the working days
//       const totalWorkingDays = workingDays + holidayCount;

//       const workingDaysDeduction =
//         (basic / totalWorkingDays) * (totalWorkingDays - leaves);

//       // Other necessary calculations for deductions
//       const lateComing = 0; // Placeholder for late coming deduction
//       const lateComingDeduction = (basic / totalWorkingDays) * lateComing;

//       // Calculate the net salary
//       const netSalary =
//         grossMonthlyAmount - workingDaysDeduction - lateComingDeduction;

//       // Create a new salary record in the database
//       const newSalary = await userSalary.create({
//         user_id: userId,
//         basic,
//         hra,
//         conveyance,
//         special_allowance: specialAllowance,
//         gross_monthly_amount: grossMonthlyAmount,
//         bonus: 0, // Placeholder for bonus
//         performance_allowance: 0, // Placeholder for performance allowance
//         deductions_working_days: workingDaysDeduction,
//         deductions_late_coming: lateComingDeduction,
//         net_salary: netSalary,
//         month,
//         year: new Date().getFullYear(), // Get the current year
//         created_at: new Date(),
//         updated_at: new Date(),
//       });

//       newSalaries.push(newSalary);
//     }

//     // Return the newly created salary records
//     res.json(newSalaries);
//   } catch (error) {
//     //


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
    const UserSalaryStructure = await UserSalaryStructure.create({
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
    res.status(201).json(UserSalaryStructure);
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error);
    res.status(500).json({ message: 'An error occurred while creating the salary structure.' });
  }
};




