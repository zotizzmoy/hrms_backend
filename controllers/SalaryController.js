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
  const { month, year } = req.body;

  if (!month || !year) {
    return res.status(400).json({ error: "Month and year are required." });
  }
  try {
    // Retrieve all users with their salary structures, attendances, and leaves

    const users = await UserModel.findAll({
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

      // Calculate the total late days for the user
      const lateDays = attendances
        ? attendances.filter((attendance) => attendance.status === "late")
          .length
        : 0;

      // Calculate the total present days for the user
      const presentDays = attendances
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
      const { gross_monthly_amount, epf, esic, professional_tax, basic } =
        salary_structure;

      const daysInCurrentMonth = dayjs(month, "MM").daysInMonth();

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

      // Prepare the salary slip object
      const salarySlip = {
        id: user.id,
        first_name: `${user.first_name} `,
        last_name: ` ${user.last_name}`,
        emp_id: `${user.emp_id}`,
        email: `${user.email}`,
        label: `${user.label}`,
        designation: `${user.designation}`,
        working_days:daysInCurrentMonth,
        present_days: presentDays,
        month,
        year,
        leaves: leavesTaken,
        late: lateDays,
        basic: basic,
        gross_salary: gross_monthly_amount,
        deductions: {
          epf,
          esic,
          professional_tax,
          late_days_deduction: lateDaysDeduction,
          leave_days_deduction: leaveDaysDeduction,
        },
        net_salary: netSalary,
      };

      salarySlips.push(salarySlip);
    }

    // Return the generated salary slips
    res.status(200).json({ salaries: salarySlips });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while generating salary slips." });
  }
};

module.exports.saveFinalsalaries = async (req, res) => {
  try {
    // Extract the array of user data from the request body
    const userDataArray = req.body;

    if (!req.body || !Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ error: "Invalid request body format. Expecting an array of user data." });
    }

    const promises = [];

    // Loop through each user data object
    for (const userData of userDataArray) {
      // Extract the user data from the object
      const {
        user_id,
        first_name,
        last_name,
        emp_id,
        email,
        month,
        year,
        label,
        working_days,
        present_days,
        leaves,
        late,
        gross_salary,
        epf,
        esic,
        professional_tax,
        late_days_deduction,
        leave_days_deduction,
        total_deduction,
        net_salary,
      } = userData;

      // Create a new user salary entry and add the promise to the array
      const promise = UserSalary.create({
        user_id: user_id,
        first_name: first_name,
        last_name: last_name,
        email: email,
        emp_id: emp_id,
        working_days: working_days,
        present_days: present_days,
        label: label,
        month,
        year,
        leaves,
        late,
        gross_salary: gross_salary,
        epf,
        esic,
        professional_tax: professional_tax,
        late_days_deduction: late_days_deduction,
        leave_days_deduction: leave_days_deduction,
        total_deductions: total_deduction,
        net_salary: net_salary,
        created_at: new Date(),
        updated_at: new Date(),
      });

      promises.push(promise);
    }

    // Execute all promises concurrently
    const createdEntries = await Promise.all(promises);

    // Send a success response with the created entries
    res.status(200).json({
      message: "User salary data saved successfully",
      createdEntries,
    });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error saving user salary data:", error);
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
