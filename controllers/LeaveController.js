const sequelize_db = require('../config/mysqlORM');



//Models
const UserModel = require('../models/Users');
const UserLeave = require('../models/UsersLeave');




// Middlewares
const sendLeaveMail = require("../middleware/sendLeaveMail");
const sendMailresponse = require("../middleware/sendMailresponse");


module.exports.applyLeave = async (req, res) => {
    const {
        user_id,
        start_date,
        end_date,
        leave_type,
        applied_on,
        reason,
        is_half_day,
    } = req.body;

    if (!user_id || !start_date) {
        return res.status(422).json({ error: "Please enter all the data" });
    }



    try {
        await sequelize_db.transaction(async (t) => {
            const user = await UserModel.findOne({
                where: {
                    id: user_id,
                },
                transaction: t,
            });

            // Calculate duration of leave
            const startDate = new Date(start_date);
            const endDate = new Date(end_date);
            const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds
            const duration = Math.round(Math.abs((startDate - endDate) / oneDay)) + 1;

            // Calculate leave deduction based on half-day or full-day leave

            let leaveDeduction = is_half_day ? 0.5 : duration;

            const leave = {
                user_id: user_id,
                applied_on: applied_on,
                start_date: start_date,
                leave_type: leave_type,
                end_date: end_date,
                is_half_day: is_half_day,
                status: "awaiting", // Set the initial status to awaiting approval
                duration: leaveDeduction,
                reason: reason,
            };



            const data = await UserLeave.create(leave, { transaction: t });

            await sendLeaveMail(
                user.first_name,
                user.last_name,
                user.emp_id,
                start_date,
                end_date,
                is_half_day,
                leave_type,
                reason
            );

            res.status(200).json(data);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Leave apply failed! Please try again" });
    }
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
            status: "approved"
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
            attributes: ["email", "first_name", "last_name", "emp_id", "total_leaves", "leave_balance"],
        });

        const { email, first_name, last_name, emp_id, total_leaves, leave_balance } = user;

        if (leave) {
            // Calculate the duration of the approved leave
            const startDate = new Date(leave.start_date);
            const endDate = new Date(leave.end_date);
            const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds
            const duration = Math.round(Math.abs((startDate - endDate) / oneDay)) + 1;

            // Deduct the leave duration from the leave_balance
            const updatedLeaveBalance = leave_balance - (leave.is_half_day ? 0.5 : duration);

            // Update the leave_balance in the UserModel
            await UserModel.update(
                { leave_balance: updatedLeaveBalance },
                { where: { id: user_id }, transaction }
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



