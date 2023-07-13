// Import necessary models
const UserModel = require("../models/Users");
const UserAttendance = require("../models/UsersAttendence");
const UserLeave = require("../models/UsersLeave");
const UserSalaryStructure = require("../models/UsersSalaryStructure");
const { Op, Sequelize } = require('sequelize');

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
      ctc_per_annum,
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
      updated_at: new Date(),
    });

    // Return the newly created entry as the response
    res.status(201).json(SalaryStructure);
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error);
    res
      .status(500)
      .json({
        message: "An error occurred while creating the salary structure.",
      });
  }
};

// Controller function to calculate deductibles
module.exports.generateSalarySlips = async (req, res) => {
  const { month, year } = req.body; // Assuming the month and year are provided in the request body

  try {
    // Retrieve all users with their salary structures and leaves
    const users = await UserModel.findAll({
      include: [
        {
          model: UserSalaryStructure,
          as: 'salary_structure',
        },
        {
          model: UserAttendance,
          as: 'attendances',
          where: Sequelize.and(
            Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('in_date')), month),
            Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('in_date')), year)
          ),
          required: false,
        },
        {
          model: UserLeave,
          as: 'leaves',
          where: Sequelize.and(
            Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('start_date')), month),
            Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('start_date')), year),
            { status: 'Approved' }
          ),
          required: false,
        },
      ],
    });
    console.log(users);

    const salarySlips = [];

    // Iterate over each user
    for (const user of users) {
      const { salary_structure, attendances, leaves } = user;

      // Calculate the total absent days and late days for the user
      let absentDays = 0;
      let lateDays = 0;
      if (attendances && attendances.length > 0) {
        for (const attendance of attendances) {
          if (attendance.attendance_status === 'absent') {
            absentDays++;
          } else if (attendance.status === 'late') {
            lateDays++;
          }
        }
      }

      // Calculate the total leaves taken by the user in the specified month
      let leavesTaken = 0;
      if (leaves && leaves.length > 0) {
        for (const leave of leaves) {
          const leaveStartDate = new Date(leave.start_date);
          const leaveEndDate = new Date(leave.end_date);
          const leaveMonth = leaveStartDate.getMonth() + 1;
          const leaveYear = leaveStartDate.getFullYear();

          // Check if the leave falls within the specified month and year
          if (leaveMonth === month && leaveYear === year) {
            // Calculate the duration of the leave
            const leaveDuration = (leaveEndDate - leaveStartDate) / (1000 * 60 * 60 * 24) + 1;

            if (leave.is_half_day === 'yes') {
              leavesTaken += 0.5;
            } else {
              leavesTaken += leaveDuration;
            }
          }
        }
      }
      
      // Calculate net salary based on deductions
      const {
        gross_monthly_amount,
        epf,
        esic,
        professional_tax,
        basic
      } = salary_structure;
      const netSalary =
        gross_monthly_amount -
        epf -
        esic -
        professional_tax -
        (basic / 3) * leavesTaken -
        (basic / 3) * lateDays;

      // Prepare the salary slip object
      const salarySlip = {
        user_id: user.id,
        user_name: `${user.first_name} ${user.last_name}`,
        month,
        year,
        gross_salary: gross_monthly_amount,
        deductions: {
          epf,
          esic,
          professional_tax,
          leaves: leavesTaken,
          absent_days: absentDays,
          late_days: lateDays,
        },
        net_salary: netSalary,
      };

      salarySlips.push(salarySlip);
    }

    // Return the generated salary slips
    res.status(200).json({ salary_slips: salarySlips });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while generating salary slips.' });
  }
};