const sequelize_db = require("../config/mysqlORM");
const { Op, Sequelize } = require("sequelize");
const dayjs = require("dayjs");

//Models
const UserModel = require("../models/Users");
const UserLeave = require("../models/UsersLeave");

// Middlewares
const sendLeaveMail = require("../middleware/sendLeaveMail");
const sendMailresponse = require("../middleware/sendMailresponse");

module.exports.applyForLeave = async (req, res) => {
  const { userId, leaveType, startDate, endDate, isHalfDay, reason } = req.body;

 

  // Calculate leave duration
  const leaveDurationInDays = calculateLeaveDuration(
    startDate,
    endDate,
    isHalfDay
  );

  // Fetch user's leave balance and joining date
  const user = await UserModel.findOne({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return res.status(400).json({ error: "User not found." });
  }

  // Check if the leave duration is greater than 3 days for casual leave
  if (leaveType === "Casual" && leaveDurationInDays > 3) {
    return res
      .status(400)
      .json({ error: "Cannot apply for more than 3 days of casual leave." });
  }

  // Apply leave type-specific rules
  let appliedOn = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
  }); // Indian current time

  if (leaveType === "Casual") {
    // Apply other rules for casual leave
  } else if (leaveType === "Medical") {
    // Apply rules for medical leave
  } else if (leaveType === "Earned") {
    // Check if the user has worked for at least a year before applying for earned leave
    const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
    if (user.date_of_joining > oneYearAgo) {
      return res.status(400).json({
        error: "You must work for at least a year to apply for earned leave.",
      });
    }

    // Apply rules for earned leave
  } else {
    return res.status(400).json({ error: "Invalid leave type." });
  }

  // Create leave entry in the database
  const leaveEntry = await UserLeave.create({
    user_id: userId,
    leave_type: leaveType,
    is_half_day: isHalfDay,
    applied_on: appliedOn,
    start_date: startDate,
    end_date: endDate,
    duration: leaveDurationInDays,
    reason,
    status: "Awaiting",
    document: "N/A",
  });

  // Fetch user data for sending email
  const mailUser = await UserModel.findOne({
    where: {
      id: userId,
    },
  });

  // Send leave mail to the admin
  await sendLeaveMail(
    mailUser.first_name,
    mailUser.last_name,
    mailUser.emp_id,
    startDate,
    endDate,
    isHalfDay,
    leaveType,
    reason
  );

  res.status(201).json({ data: leaveEntry });
};

//Helper function to calculate leave duration

const calculateLeaveDuration = (startDate, endDate, isHalfDay) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const oneDayInMilliseconds = 1000 * 60 * 60 * 24;
  const halfDayInMilliseconds = oneDayInMilliseconds / 2;

  const durationInMilliseconds =
    Math.abs(end - start) +
    (isHalfDay ? halfDayInMilliseconds : oneDayInMilliseconds);
  const days = durationInMilliseconds / oneDayInMilliseconds;

  return isHalfDay ? 0.5 : Math.ceil(days);
};

module.exports.calculateLeaves = async (req, res) => {
  try {
    const { user_id } = req.body;
    if (!user_id) {
      return res.status(400).json({
        error: "Please provide user_id",
      });
    }

    // Retrieve applied leaves and join with User table
    const appliedLeaves = await UserLeave.findAll({
      where: { user_id: user_id, status: "Approved" },
      include: [
        {
          model: UserModel,
          attributes: ["first_name", "last_name", "emp_id"],
        },
      ],
    });

    const appliedLeavesCount = appliedLeaves.length;

    // Retrieve paid leaves
    const remainingLeaves = await UserModel.findOne({
      where: { id: user_id },
    });

    const paidLeaves = remainingLeaves.paid_leaves;
    // Prepare response JSON
    const response = {
      leaves: [
        {
          leave_balance: paidLeaves,
          applied_leaves: appliedLeavesCount,
        },
      ],
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error calculating leaves:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.uploadDocument = async (req, res) => {
  try {
    const update = {
      document: req.file.filename,
    };

    await UserLeave.update(update, {
      where: { user_id: req.body.user_id, leave_type: "Medical" },
    });

    res.status(200).json({
      data: await UserLeave.findOne({
        where: { id: req.body.user_id, leave_type: "Medical" },
      }),
    });
  } catch (error) {
    res.status(422).json({
      error: error.message,
    });
  }
};

module.exports.changeStatus = async (req, res) => {
  const { leave_id } = req.body;
  let transaction;

  try {
    // Start a transaction
    transaction = await sequelize_db.transaction();

    const leaveEntry = await UserLeave.findOne({
      where: {
        id: leave_id,
      },
      transaction, // Pass the transaction to the query
    });

    if (!leaveEntry) {
      await transaction.rollback();
      return res.status(404).json({ error: "Leave entry not found." });
    }

    const userLeaveBalance = await UserModel.findOne({
      where: {
        id: leaveEntry.user_id,
      },
      transaction, // Pass the transaction to the query
    });

    if (!userLeaveBalance) {
      await transaction.rollback();
      return res.status(400).json({ error: "User leave balance not found." });
    }

    if (leaveEntry.leave_type === "Paid" && leaveEntry.status === "Awaiting") {
      const leaveDurationInDays = leaveEntry.is_half_day
        ? 0.5
        : leaveEntry.duration; // Adjust the leave duration
      const remainingPaidLeaves = userLeaveBalance.paid_leaves;
      const usedPaidLeaves = Math.min(leaveDurationInDays, remainingPaidLeaves);

      userLeaveBalance.paid_leaves -= usedPaidLeaves;
      await userLeaveBalance.save({ transaction }); // Pass the transaction to the save operation
    }

    leaveEntry.status = "Approved";
    await leaveEntry.save({ transaction }); // Pass the transaction to the save operation

    // Send email with the updated leave status
    await sendMailresponse(
      userLeaveBalance.email,
      userLeaveBalance.first_name,
      userLeaveBalance.last_name,
      userLeaveBalance.emp_id,
      leaveEntry.start_date,
      leaveEntry.end_date,
      leaveEntry.is_half_day,
      leaveEntry.leave_type,
      leaveEntry.reason,
      leaveEntry.status
    );

    // Commit the transaction
    await transaction.commit();

    res.status(200).json({ leave: leaveEntry });
  } catch (error) {
    console.error(error);
    if (transaction) {
      await transaction.rollback();
    }
    res.status(422).json({
      error: error.message,
    });
  }
};

module.exports.cancelledStatus = async (req, res) => {
  try {
    const { user_id, leave_id, cancel_reason } = req.body;

    const update = {
      status: "cancelled",
      cancel_reason: cancel_reason,
    };

    let leave;

    await sequelize_db.transaction(async (transaction) => {
      await UserLeave.update(update, {
        where: { user_id, id: leave_id },
        transaction,
      });
      leave = await UserLeave.findOne({
        where: { user_id, id: leave_id },
        transaction,
      });
    });

    const user = await UserModel.findOne({
      where: { id: user_id },
      attributes: ["email", "first_name", "last_name", "emp_id"],
    });

    const { email, first_name, last_name, emp_id } = user;

    if (leave) {
      await sendMailresponse(
        email,
        first_name,
        last_name,
        emp_id,
        leave.start_date,
        leave.end_date,
        leave.is_half_day,
        leave.leave_type,
        leave.cancel_reason,
        leave.status
      );
    }

    res.status(200).json({ leave });
  } catch (error) {
    res.status(422).json({
      error: error.message,
    });
  }
};

module.exports.getAllleaves = async (req, res) => {
  try {
    // Retrieve applied leaves and join with User table
    const appliedLeaves = await UserLeave.findAll({
      where: { user_id: req.body.user_id },
      order: [["applied_on", "DESC"]],
    });

    const appliedLeaveDetails = appliedLeaves.map((leave) => {
      return {
        leave_id: leave.id,
        applied_on: leave.applied_on,
        start_date: leave.start_date,
        end_date: leave.end_date,
        leave_type: leave.leave_type,
        isHalfDay: leave.is_half_day,
        status: leave.status,
      };
    });

    res.status(200).json(appliedLeaveDetails);
  } catch (error) {
    console.error("Error retrieving leaves:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
