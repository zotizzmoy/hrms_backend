// Import necessary models
const UserModel = require("../models/Users");
const UserAttendance = require("../models/UsersAttendence");
const UserLeave = require("../models/UsersLeave");
const UserSalaryStructure = require("../models/UsersSalaryStructure");
const UserSalary = require("../models/UsersSalary");
const dayjs = require("dayjs");
const { Sequelize } = require("sequelize");

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
    res.status(500).json({
      message: "An error occurred while creating the salary structure.",
    });
  }
};

module.exports.generateSalarySlips = async (req, res) => {
  const { month, year, label } = req.body;

  if (!month || !year || !label) {
    return res.status(400).json({ error: "Month, year, and label are required." });
  }
  try {
    // Retrieve all users with their salary structures, attendances, and leaves

    const users = await UserModel.findAll({
      where: { label },
      include: [
        {
          model: UserSalaryStructure,
          as: "salary_structure",
        },
        {
          model: UserAttendance,
          as: "attendances",
          where: Sequelize.and(
            Sequelize.where(
              Sequelize.fn("MONTH", Sequelize.col("attendances.in_date")),
              month
            ),
            Sequelize.where(
              Sequelize.fn("YEAR", Sequelize.col("attendances.in_date")),
              year
            )
          ),
          required: false,
        },
        {
          model: UserLeave,
          as: "leaves",
          where: Sequelize.and(
            Sequelize.where(
              Sequelize.fn("MONTH", Sequelize.col("leaves.start_date")),
              month
            ),
            Sequelize.where(
              Sequelize.fn("YEAR", Sequelize.col("leaves.start_date")),
              year
            ),
            { status: "approved" }
          ),
          required: false,
        },
      ],
    });

    const salarySlips = [];

    // Iterate over each user
    for (const user of users) {
      const { salary_structure, attendances, leaves } = user;

      // Add a validation to check if salary_structure is empty for any user
      if (!salary_structure) {
        return res.status(500).json({ error: "Salary structure not found for a user." });
      }

      // Calculate the total late days for the user
      let lateDays = attendances
        ? attendances.filter((attendance) => attendance.status === "late")
          .length
        : 0;

      // Calculate the total present days for the user
      let presentDays = attendances
        ? attendances.filter((attendance) => attendance).length
        : 0;

      // Calculate the total leaves taken by the user in the specified month
      let leavesTaken = 0;

      if (leaves && leaves.length > 0) {
        for (const leave of leaves) {
          const leaveStartDate = new Date(leave.start_date);
          const leaveEndDate = new Date(leave.end_date);
          const leaveMonth = dayjs(leaveStartDate).format("MM");

          const leaveYear = dayjs(leaveStartDate).format("YYYY");

          // Check if the leave falls within the specified month and year
          if (leaveMonth === month && leaveYear === year) {
            // Calculate the duration of the leave
            const leaveDuration =
              (leaveEndDate - leaveStartDate) / (1000 * 60 * 60 * 24) + 1;

            if (leave.is_half_day === "yes") {
              leavesTaken += 0.5;
            } else {
              leavesTaken += leaveDuration;
            }
          }
        }
      }
      // Calculate net salary based on deductions
      let { gross_monthly_amount, epf, esic, professional_tax, basic } =
        salary_structure;

      let daysInCurrentMonth = dayjs(month, "MM").daysInMonth();

      let leaveDaysDeduction = 0;
      if (user.leave_balance > 0) {
        leaveDaysDeduction = 0
      } else {
        leaveDaysDeduction = Math.round(
          (basic / daysInCurrentMonth) * (leavesTaken)
        );
      }


      let lateDaysDeduction =
        Math.floor(basic / daysInCurrentMonth) * Math.floor(lateDays / 3);

      let netSalary;
      if (user.leave_balance > 0) {
        netSalary = Math.round(gross_monthly_amount - epf - esic - professional_tax - lateDaysDeduction);
      } else {
        netSalary = Math.round(gross_monthly_amount - epf - esic - professional_tax - leaveDaysDeduction - lateDaysDeduction);
      }
      // Check if the salary slip for the user with the same month and year already exists
      const existingSalarySlip = await UserSalary.findOne({
        where: {
          user_id: user.id,
          month: month,
          year: year,
        },
      });
      if (existingSalarySlip) {
        return res.status(422).json({
          error: `Salary slip for user with ID ${user.id}, month ${month}, and year ${year} already exists.`,
        });
      }

      // Prepare the salary slip object
      const salarySlip = {
        user_id: `${user.id}`,
        first_name: `${user.first_name}`,
        last_name: `${user.last_name}`,
        emp_id: `${user.emp_id}`,
        email: `${user.email}`,
        label: `${user.label}`,
        designation: `${user.designation}`,
        working_days: daysInCurrentMonth,
        present_days: presentDays,
        month,
        year,
        leaves: leavesTaken,
        adjust_leave: null,
        adjust_leave: null,
        late: lateDays,
        basic: basic,
        gross_salary: gross_monthly_amount,
        epf,
        esic,
        professional_tax,
        late_days_deduction: lateDaysDeduction,
        leave_days_deduction: leaveDaysDeduction,
        total_deductions: (lateDaysDeduction + leaveDaysDeduction),
        net_salary: netSalary,
        created_at: new Date(),
        updated_at: new Date(),
      };

      salarySlips.push(salarySlip);
    }

    // Check if any salary slip data exists for any user with the given month and year
    if (salarySlips.length === 0) {
      return res.status(422).json({
        error: `Salary for all users with month ${month} and year ${year} already exist.`,
      });
    }

    // Save all the salary slips for all users in a single database operation
    await UserSalary.bulkCreate(salarySlips);


    const userSalaries = await UserSalary.findAll({
      where: {
        month: month,
        year: year,
      },

    });

    res.status(200).json({ salaries: userSalaries });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while generating salary slips." });
  }
};

module.exports.updateUserSalaryEntry = async (req, res) => {
  const id = req.body.id;

  try {


    // Find the existing user salary entry by its id
    const existingEntry = await UserSalary.findByPk(id);

    if (!existingEntry) {
      return res.status(404).json({ error: "User salary entry not found." });
    }

    // Update the user salary entry
    await existingEntry.update({
      working_days: req.body.working_days,
      present_days: req.body.present_days,
      label: req.body.label,
      month: req.body.month,
      year: req.body.year,
      leaves: req.body.leaves,
      late: req.body.late,
      gross_salary: req.body.gross_salary,
      adjust_leaves: req.body.adjust_leaves,
      adjust_late: req.body.adjust_leave,
      late_days_deduction: req.body.late_days_deduction,
      leave_days_deduction: req.body.leave_days_deduction,
      total_deductions: req.body.total_deductions,
      net_salary: req.body.net_salary,
      updated_at: new Date(),
    });

    // Send a success response with the updated entry
    res.status(200).json({
      message: "Salary Generated",
      updatedEntry: existingEntry,
    });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error updating user salary data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};




module.exports.salariesByMonthAndYear = async (req, res) => {
  try {
    const { month, year } = req.params;

    const userSalaries = await UserSalary.findAll({
      where: {
        month,
        year,
      },
      raw: true,
    });

    res.status(200).json(userSalaries);
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error retrieving user salaries:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
