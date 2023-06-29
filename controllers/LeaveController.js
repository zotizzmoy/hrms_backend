const sequelize_db = require('../config/mysqlORM');



//Models
const UserLeave = require('../models/UsersLeave');
const UserModel = require('../models/Users');



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

    const leave = {
        user_id: user_id,
        applied_on: applied_on,
        start_date: start_date,
        leave_type: leave_type,
        end_date: end_date,
        is_half_day: is_half_day,
        status: "awaiting",
        reason: reason,
    };

    try {
        const data = await UserLeave.create(leave);
        const user = await UserModel.findOne({
            where: {
                id: user_id,
            },
        });
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
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Leave apply failed" });
    }


};



module.exports.calculateLeaves = async (req, res) => {
    // Assuming you have the User model imported

    try {
        // Retrieve total leaves
        const totalLeaves = await UserModel.findAll({
            where:{id:req.body.user_id},
            attributes: ['leave_balance']
        })
        console.log(totalLeaves);

        // Retrieve applied leaves and join with User table
        const appliedLeaves = await UserLeave.findAll({
            where: { user_id: req.body.user_id, status: 'approved' },
            include: [
                {
                    model: UserModel,
                    attributes: ['first_name', 'last_name', 'emp_id']
                }
            ]
        });



        const appliedLeaveIds = appliedLeaves.map((leave) => leave.id);
        const appliedLeavesCount = appliedLeaves.length;

        // Calculate leave durations and subtract from total leaves
        let remainingLeaves = totalLeaves;
        let remainingHalfLeaves = totalLeaves;
        const leaveDurations = appliedLeaves.map((leave) => {
            const startDate = new Date(leave.start_date);
            const endDate = new Date(leave.end_date);
            const duration = (endDate - startDate) / (1000 * 60 * 60 * 24); // Difference in days

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
            total_leaves: totalLeaves,
            applied_leaves: appliedLeavesCount,
            available_leaves: remainingHalfLeaves,


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
            document:   req.file.filename
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



