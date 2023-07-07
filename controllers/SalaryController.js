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
    const UsersSalaryStructure = await UserSalaryStructure.create({
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
    res.status(201).json(UsersSalaryStructure);
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error);
    res.status(500).json({ message: 'An error occurred while creating the salary structure.' });
  }
};






// Controller function to calculate deductibles
async function calculateDeductibles(req, res) {
  try {
    const userId = req.params.userId;

    // Fetch user details
    const user = await UserModel.findByPk(userId, {
      include: [
        {
          model: UserSalaryStructure,
          as: 'salary_structure',
        },
        {
          model: UserLeave,
          as: 'leaves',
          where: {
            status: 'Approved',
            start_date: { [Op.lte]: new Date() }, // Consider only approved leaves that have started
            end_date: { [Op.gte]: new Date() }, // and have not yet ended
          },
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate deductibles
    const salaryStructure = user.salary_structure;
    const leavesTaken = user.leaves.length;
    const absentDays = getAbsentDays(); // Implement your own logic to get the number of absent days

    const epfDeductible = calculateEPFDeductible(salaryStructure.basic);
    const professionalTaxDeductible = calculateProfessionalTaxDeductible(salaryStructure.gross_monthly_amount);
    const absentDaysDeductible = calculateAbsentDaysDeductible(salaryStructure.gross_monthly_amount, absentDays);
    const leavesTakenDeductible = calculateLeavesTakenDeductible(salaryStructure.gross_monthly_amount, leavesTaken);

    // Return the deductibles
    return res.json({
      epfDeductible,
      professionalTaxDeductible,
      absentDaysDeductible,
      leavesTakenDeductible,
    });
  } catch (error) {
    console.error('Error calculating deductibles:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Helper function to calculate EPF deductible
function calculateEPFDeductible(basicSalary) {
  // Implement your logic to calculate the EPF deductible based on the basic salary
  const epfPercentage = 5; // Example EPF percentage
  return (basicSalary * epfPercentage) / 100;
}

// Helper function to calculate professional tax deductible
function calculateProfessionalTaxDeductible(grossSalary) {
  // Implement your logic to calculate the professional tax deductible based on the gross salary
  const professionalTaxPercentage = 2; // Example professional tax percentage
  return (grossSalary * professionalTaxPercentage) / 100;
}

// Helper function to calculate absent days deductible
function calculateAbsentDaysDeductible(grossSalary, absentDays) {
  // Implement your logic to calculate the absent days deductible based on the gross salary and number of absent days
  const perDayDeduction = 100; // Example deduction per absent day
  return perDayDeduction * absentDays;
}

// Helper function to calculate leaves taken deductible
function calculateLeavesTakenDeductible(grossSalary, leavesTaken) {
  // Implement your logic to calculate the leaves taken deductible based on the gross salary and number of leaves taken
  const perLeaveDeduction = 200; // Example deduction per leave taken
  return perLeaveDeduction * leavesTaken;
}

// Helper function to get the number of absent days
function getAbsentDays() {
  // Implement your own logic to get the number of absent days for the user
  // This could involve querying the attendance records or any other method specific to your application
  // Return the number of absent days as an integer
}

module.exports = {
  calculateDeductibles,
};
