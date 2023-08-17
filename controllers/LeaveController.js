const sequelize_db = require('../config/mysqlORM');
const { Op, Sequelize } = require('sequelize');



//Models
const UserModel = require('../models/Users');
const UserLeave = require('../models/UsersLeave');


// Middlewares
const sendLeaveMail = require("../middleware/sendLeaveMail");
const sendMailresponse = require("../middleware/sendMailresponse");

// Controller function to apply for leave
module.exports.applyForLeave = async (req, res) => {
    const { userId, leaveType, startDate, endDate, isHalfDay, reason } = req.body;
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const firstDateOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const lastDateOfMonth = new Date(currentYear, currentMonth, 0);

    const userPaidLeavesThisMonth = await UserLeave.count({
        where: {
            user_id: userId,
            leave_type: "Paid",
            status: "Approved",
            start_date: {
                [Op.between]: [firstDateOfMonth, lastDateOfMonth],
            },
        },
    });

    const leaveDurationInDays = calculateLeaveDuration(startDate, endDate, isHalfDay);

    if (leaveType === "Paid") {
        // Check if the user has already taken a paid leave in the current month
        const hasTakenPaidLeaveThisMonth = userPaidLeavesThisMonth > 0;

        if (hasTakenPaidLeaveThisMonth) {
            return res.status(400).json({ error: "You can take only one paid leave per month." });
        }
    }

    if (leaveType === "Casual" || leaveType === "Medical") {
        // No additional checks needed for casual and medical leaves
    } else if (leaveType === "Paid") {
        // Check remaining paid leaves and handle accordingly
        const userLeaveBalance = await UserModel.findOne({
            where: {
                id: userId,
            },
        });

        if (!userLeaveBalance.paid_leaves) {
            return res.status(400).json({ error: "User leave balance not found." });
        }

        const remainingPaidLeaves = userLeaveBalance.paid_leaves;

        if (leaveDurationInDays > remainingPaidLeaves) {
            return res.status(400).json({ error: `Insufficient paid leaves. You have ${remainingPaidLeaves} paid leaves left.` });
        }
    } else {
        return res.status(400).json({ error: "Invalid leave type." });
    }

    const leaveEntry = await UserLeave.create({
        user_id: userId,
        leave_type: leaveType,
        is_half_day: isHalfDay ? "Yes" : "No",
        applied_on: new Date().toISOString(),
        start_date: startDate,
        end_date: endDate,
        duration: leaveDurationInDays,
        reason,
        status: "Awaiting",
        document: "N/A",
    });

    res.status(201).json({ data: leaveEntry });
};

const calculateLeaveDuration = (startDate, endDate, isHalfDay) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const oneDayInMilliseconds = 1000 * 60 * 60 * 24;
    const durationInMilliseconds = Math.abs(end - start) + (isHalfDay ? oneDayInMilliseconds / 2 : oneDayInMilliseconds);
    const days = durationInMilliseconds / oneDayInMilliseconds;
    return Math.ceil(days);
};


module.exports.calculateLeaves = async (req, res) => {
    // Assuming you have the User model imported

    try {
        const { user_id } = req.body;
        if (!user_id) {
            return res.status(400).json({
                error: "Please provide user_id"
            });
        }



        // Retrieve applied leaves and join with User table
        const appliedLeaves = await UserLeave.findAll({
            where: { user_id: user_id, status: 'approved' },
            include: [
                {
                    model: UserModel,
                    attributes: ['first_name', 'last_name', 'emp_id']
                }
            ]
        });

        const appliedLeavesCount = appliedLeaves.length;
        // Retrieve total leaves
        const user = await UserModel.findOne({
            where: { id: user_id },

        });

        // Calculate leave durations and subtract from total leaves
        let remainingLeaves = user.leave_balance;
        let remainingHalfLeaves = user.leave_balance;
        const leaveDurations = appliedLeaves.map((leave) => {
            const startDate = new Date(leave.start_date);
            const endDate = new Date(leave.end_date);
            const duration = (endDate - startDate) / (1000 * 60 * 60 * 24) + 1; // Difference in days

            remainingLeaves -= duration;

            // Check if the leave is a half-day leave
            if (leave.is_half_day === "yes") {
                remainingHalfLeaves -= 0.5;
            } else {
                remainingHalfLeaves -= duration;
            }

            return {
                leaveId: leave.id,
                startDate: leave.start_date,
                endDate: leave.end_date,
                duration: duration,
                isHalfDay: leave.is_half_day
            };
        });

        // Prepare response JSON
        const response = {
            leaves: [
                {
                    leave_balance: remainingLeaves,
                    applied_leaves: appliedLeavesCount,
                    available_leaves: remainingHalfLeaves
                }
            ]
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error calculating leaves:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

};






module.exports.uploadDocument = async (req, res) => {
    try {



        const update = {
            document: req.file.filename
        }
        created_user = await UserLeave.update(update, { where: { user_id: req.body.user_id } });
        res.status(200).json({
            data: await UserLeave.findOne({ where: { user_id: req.body.user_id } })
        });

    } catch (error) {
        res.status(422).json({
            error: error.message
        })

    }

};
module.exports.changeStatus = async (req, res) => {
    try {
        const { user_id, leave_id } = req.body;

        const update = {
            status: "Approved"
        };

        let leave;

        await sequelize_db.transaction(async (transaction) => {
            // Find the leave details before updating the status
            leave = await UserLeave.findOne({ where: { user_id, id: leave_id }, transaction });

            // Update the status of the leave to "approved"
            await UserLeave.update(update, { where: { user_id, id: leave_id }, transaction });
        });

        const user = await UserModel.findOne({
            where: { id: user_id },
            attributes: ["email", "first_name", "last_name", "emp_id", "paid_leaves"],
        });

        const { email, first_name, last_name, emp_id, paid_leaves } = user;
        console.log(user);

        if (leave) {
            // Calculate the duration of the approved leave
            const startDate = new Date(leave.start_date);
            const endDate = new Date(leave.end_date);
            const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds
            const duration = Math.round(Math.abs((startDate - endDate) / oneDay)) + 1;

            // Deduct the leave duration from the leave_balance
            const updatedLeaveBalance = user.paid_leaves - (leave.is_half_day ? 0.5 : duration);
            console.log(updatedLeaveBalance);

            // Update the leave_balance in the UserModel
            await UserModel.update(
                { paid_leaves: updatedLeaveBalance },
                { where: { id: user_id } }
            );

            // Send email with the updated leave status
            await sendMailresponse(
                email,
                first_name,
                last_name,
                emp_id,
                leave.start_date,
                leave.end_date,
                leave.is_half_day,
                leave.leave_type,
                leave.reason,
                leave.status
            );
        }

        res.status(200).json({ leave });

    } catch (error) {
        console.error(error)
        res.status(422).json({
            error: error.message
        });
    }
};


module.exports.cancelledStatus = async (req, res) => {
    try {
        const { user_id, leave_id } = req.body;

        const update = {
            status: "cancelled"
        };

        let leave;

        await sequelize_db.transaction(async (transaction) => {
            await UserLeave.update(update, { where: { user_id, id: leave_id }, transaction });
            leave = await UserLeave.findOne({ where: { user_id, id: leave_id }, transaction });
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
                leave.reason,
                leave.status
            );
        }

        res.status(200).json({ leave });

    } catch (error) {
        res.status(422).json({
            error: error.message
        });
    }
};



module.exports.getAllleaves = async (req, res) => {
    try {
        // Retrieve applied leaves and join with User table
        const appliedLeaves = await UserLeave.findAll({
            where: { user_id: req.body.user_id },
            order: [['applied_on', 'DESC']]

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
        console.error('Error retrieving leaves:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

};



module.exports.demoTest = async (req, res) => {
    const { user_id } = req.body;
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    // Calculate the first and last date of the current month
    const firstDateOfMonth = new Date(currentYear, currentMonth - 1, 1); // Months are 0-indexed
    const lastDateOfMonth = new Date(currentYear, currentMonth, 0); // The 0th day of the next month is the last day of the current month

    try {
        const userPaidLeavesThisMonth = await UserLeave.count({
            where: {
                user_id: user_id,
                leave_type: "Paid",
                status: "Approved",
                start_date: {
                    [Op.between]: [firstDateOfMonth, lastDateOfMonth],
                },
            },
        });
        res.json(userPaidLeavesThisMonth);
    } catch (error) {
        res.json(error.message);
    }
};