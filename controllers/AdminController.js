//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//IMPORT THINGS ON THE TOP
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const express = require("express");
const { Op, Sequelize } = require('sequelize');
const helper = require("../helper/helper");




//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Models
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const UserModel = require('../models/Users');
const UserAttendence = require('../models/UsersAttendence');
const UserActivity = require('../models/UsersActivity');
const AdminModel = require('../models/Admin');
const UserLeave = require("../models/UsersLeave");
const UsersPersonalDetail = require('../models/UsersPersonalDetail');
const UsersEducationDetail = require('../models/UsersEducation');
const UsersDocument = require('../models/UsersDocument');
const UsersBankDetail = require('../models/UsersBankDetail');
const UserSalaryStructure = require('../models/UsersSalaryStructure');

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Route Login
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.Adminlogin = async function (req, res) {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const admin = await AdminModel.findOne({ where: { email } });
        if (!admin) {
            return res.status(404).json({ message: 'admin not found' });
        }

        // Check if password matches
        const isMatch = await password === admin.password;
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create and send JWT token
        const payload = {
            admin_id: admin.id,
            admin_role: admin.role

        }

        helper.generateJwt(payload)

        const data = await AdminModel.findOne({
            where: { email: email },
            attributes: ['email', 'role']
        })


        res.status(200).json({ token: helper.generateJwt(payload), user: data });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }


};



//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Route AllEmployee
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.allEmployee = async function (req, res) {
    try {
        const users = await UserModel.findAll({
            order: [['created_at', 'DESC']]
        });
        res.status(200).json({ users });
    } catch (error) {
        console.log('Error retrieving employee:', error);
        res.status(500).json({ error: 'Error retrieving employee' });
    }
};

module.exports.allEmployeeCount = async function (req, res) {
    try {
        const users = await UserModel.count({})
        res.status(200).json({ users })
    } catch (error) {
        res.status(500).json({ error: 'Failed to count' })
    }
};


module.exports.countAttendanceOnDate = async function (req, res) {
    const { date } = req.body;
    try {
        const count = await UserAttendence.count({
            where: {
                in_date: date
            }
        })
        res.status(200).json({ count })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error counting attendance' });
    }
};

module.exports.attendanceExporter = async function (req, res) {
    const { start_date, end_date, } = req.body;
    try {
        const attendances = await UserAttendence.findAll({

            where: {
                // user_id: user_id,
                in_date: {
                    [Op.between]: [start_date, end_date],
                },
            },
            include: {
                model: UserModel,
                attributes: ["first_name", "last_name", "user_image", "emp_id", "designation"],
            },
        });

        res.json(attendances);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while retrieving attendance." });
    }

};
module.exports.UserattendanceExporter = async function (req, res) {
    const { start_date, end_date, user_id } = req.body;
    try {
        const attendances = await UserAttendence.findAll({

            where: {
                user_id: user_id,
                in_date: {
                    [Op.between]: [start_date, end_date],
                },
            },
            include: {
                model: UserModel,
                attributes: ["first_name", "last_name", "user_image", "emp_id", "designation"],
            },
        });

        res.json(attendances);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while retrieving attendance." });
    }

};


module.exports.latestAttendance = async function (req, res) {
    const { date } = req.body;
    try {
        const attendances = await UserAttendence.findAll({
            order: [['created_at', 'DESC']],
            where: {

                in_date: date

            },
            include: {
                model: UserModel,
                attributes: ["first_name", "last_name", "emp_id", "user_image", "designation"],
            },
        });
        res.status(200).json(attendances)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "An error occured while retrieving attendance" })
    }
};

module.exports.activityExporter = async function (req, res) {
    const { start_date, end_date } = req.body;
    try {
        const activity = await UserActivity.findAll({

            where: {

                date: {
                    [Op.between]: [start_date, end_date],
                },
            },
            include: {
                model: UserModel,
                attributes: ["first_name", "last_name", "user_image", "emp_id", "designation"],
            },
        });

        res.json(activity);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while retrieving attendance." });
    }

};
module.exports.UseractivityExporter = async function (req, res) {
    const { start_date, end_date, user_id } = req.body;
    try {
        const activity = await UserActivity.findAll({

            where: {
                user_id: user_id,
                date: {
                    [Op.between]: [start_date, end_date],
                },
            },
            include: {
                model: UserModel,
                attributes: ["first_name", "last_name", "user_image", "emp_id", "designation"],
            },
        });

        res.json(activity);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while retrieving attendance." });
    }

};

module.exports.countLateUsers = async function (req, res) {
    const { date } = req.body;
    try {
        const lateUsers = await UserAttendence.count({
            where: {
                in_date: date,
                status: "late"
            },

        })
        res.json(lateUsers)
    } catch (error) {

        console.error('Error counting late users:', error);
        res.status(500).json({ error: 'Internal server error' });

    }

};

module.exports.LateUsers = async function (req, res) {
    const { date } = req.body;
    try {
        const lateUsers = await UserAttendence.findAll({
            where: {
                in_date: date,
                status: "late"
            },
            include: {
                model: UserModel,
                attributes: ["first_name", "last_name", "user_image", "emp_id", "designation"],
            },
        })
        res.json(lateUsers)
    } catch (error) {

        console.error('Error counting late users:', error);
        res.status(500).json({ error: 'Internal server error' });

    }

};
module.exports.deleteUser = async function (req, res) {
    const { id } = req.body;
    try {
        // Find the user by their ID
        const user = await UserModel.findByPk(id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const update = {
            deleted_at: Date.now()
        }
        // Implementing soft delete
        await UserModel.update(update, { where: { id: id } });



        // Delete the user's attendances
        await UserAttendence.destroy({ where: { user_id: id } });

        // Delete the user's activities
        await UserActivity.destroy({ where: { user_id: id } });

        // Delete the user's leaves
        await UserLeave.destroy({ where: { user_id: id } });




        // Delete the user
        await user.destroy({
            force: false, //soft delete
        });

        res.status(200).json({ message: 'User, attendances, activities, leaves deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



module.exports.cleanAttendance = async function (req, res) {
    const { start_date, end_date } = req.body;
    try {
        const cleanAttendance = await UserAttendence.destroy({

            where: {

                in_date: {
                    [Op.between]: [start_date, end_date],
                },
            },

        });

        res.json({ message: 'Attendance cleaned' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while retrieving attendance." });
    }


};


module.exports.cleanActivity = async function (req, res) {
    const { start_date, end_date } = req.body;
    try {

        const cleanActivity = await UserActivity.destroy({

            where: {

                date: {
                    [Op.between]: [start_date, end_date],
                },
            },

        });

        res.json({ message: 'Activity cleaned' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while retrieving attendance." });
    }


};

module.exports.countAbsentUsers = async function (req, res) {
    try {
        const { date } = req.body;
        // Count total users
        const totalUsersCount = await UserModel.count();

        // Count present users
        const presentUsersCount = await UserAttendence.count({
            where: {
                attendance_status: 'present',
                in_date: date
            },
        });

        // Calculate the difference
        const absentUsersCount = totalUsersCount - presentUsersCount;

        return res.json({
            totalUsersCount: totalUsersCount,
            absentUsers: absentUsersCount,
        });
    } catch (error) {
        console.error('Error retrieving present users count:', error);
        return res.status(500).json({ error: 'An error occurred while retrieving the present users count.' });
    }
};

module.exports.findAbsentUsers = async function (req, res) {
    try {
        const { date } = req.body;

        // Find users who are not present on the specified date
        const absentUsers = await UserModel.findAll({
            include: {
                model: UserAttendence,
                as: 'attendances',
                required: false,
                where: {
                    in_date: date,

                },
            },
            where: {
                '$attendances.user_id$': null,
            },
        });

        return res.json(absentUsers);
    } catch (error) {
        console.error('Error retrieving absent users:', error);
        return res.status(500).json({ error: 'An error occurred while retrieving absent users.' });
    }
};


//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//leave Admin part starts 
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

module.exports.leaveRequests = async function (req, res) {
    try {
        const users = await UserModel.findAll({
            attributes: ['id', 'emp_id', 'first_name', 'last_name', 'user_image', 'designation'],
            include: [
                {
                    model: UserLeave,
                    as: 'leaves',
                    order: [['applied_on', 'DESC']]
                }
            ]
        });

        const formattedData = users.flatMap(user => {
            const { id, emp_id, first_name, last_name, user_image, designation } = user;
            return user.leaves.map(leave => ({
                user_id: id,
                emp_id,
                first_name,
                last_name,
                user_image,
                designation,
                id: leave.id,
                leave_type: leave.leave_type,
                is_half_day: leave.is_half_day,
                applied_on: leave.applied_on,
                start_date: leave.start_date,
                end_date: leave.end_date,
                reason: leave.reason,
                status: leave.status,
                document: leave.document
            }));
        });

        res.status(200).json(formattedData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports.leaveCountForSevenDays = async function (req, res) {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const appliedLeaves = await UserLeave.findAll({
            where: {
                applied_on: {
                    [Sequelize.Op.gte]: sevenDaysAgo,
                },
            },
            include: {
                model: UserModel,
                attributes: ['first_name', 'last_name', 'emp_id']
            }
        });

        const numberOfLeaves = appliedLeaves.length;

        res.status(200).json({ numberOfLeaves, appliedLeaves });
    } catch (error) {
        console.error('Error counting leaves:', error);
        res.status(500).json({ error: 'Internal server error' });
    }


};


module.exports.onleaveCount = async function (req, res) {
    try {
        const { start_date } = req.body;

        const leaveCount = await UserLeave.count({
            where: {
                start_date: start_date,
                status: 'approved'
            },
            include: {
                model: UserModel,
                attributes: ['first_name', 'last_name', 'emp_id']
            }
        });

        res.status(200).json({ leaveCount });
    } catch (error) {
        console.error('Error counting leaves:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

};



module.exports.calculateAllUsersleaveBalance = async function (req, res) {
    try {
        // Retrieve all users
        const users = await UserModel.findAll();

        // Get the current year
        const currentYear = new Date().getFullYear();

        // Calculate leaves for each user
        const leaveCalculations = await Promise.all(
            users.map(async (user) => {
                // Retrieve approved applied leaves for the user
                const approvedLeaves = await UserLeave.findAll({
                    where: {
                        user_id: user.id,
                        status: 'Approved',
                        start_date: { [Op.gte]: new Date(`${currentYear}-01-01`) },
                        end_date: { [Op.lte]: new Date(`${currentYear}-12-31`) },
                    },
                });

                let totalPaidLeavesTaken = 0;
                let totalCasualLeaves = 0;
                let totalMedicalLeaves = 0;

                approvedLeaves.forEach(leave => {
                    const startDate = new Date(leave.start_date);
                    const endDate = new Date(leave.end_date);

                    // Calculate the difference in days (including start and end dates)
                    const durationInDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

                    if (leave.is_half_day) {
                        // For half-day leaves, add 0.5 to the appropriate leave type
                        if (leave.leave_type === 'Paid') {
                            totalPaidLeavesTaken += 0.5;
                        } else if (leave.leave_type === 'Casual') {
                            totalCasualLeaves += 0.5;
                        } else if (leave.leave_type === 'Medical') {
                            totalMedicalLeaves += 0.5;
                        }
                    } else if (leave.leave_type === 'Paid') {
                        totalPaidLeavesTaken += durationInDays;
                    } else if (leave.leave_type === 'Casual') {
                        totalCasualLeaves += durationInDays;
                    } else if (leave.leave_type === 'Medical') {
                        totalMedicalLeaves += durationInDays;
                    }
                });

                // Calculate remaining paid leaves
                const remainingPaidLeaves = user.paid_leaves;

                return {
                    user_id: user.id,
                    emp_id: user.emp_id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    remaining_paid_leaves: remainingPaidLeaves,
                    total_paid_leaves_taken: totalPaidLeavesTaken,
                    total_casual_leaves: totalCasualLeaves,
                    total_medical_leaves: totalMedicalLeaves,
                };
            })
        );

        res.status(200).json(leaveCalculations);
    } catch (error) {
        console.error('Error calculating leaves:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};












//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//User Admin part starts 
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


module.exports.getAlluserDetails = async (req, res) => {
    try {
        const { user_id } = req.body;
        const user = await UserModel.findByPk(user_id, {
            include: [
                {
                    model: UsersPersonalDetail,
                    as: 'personal_details',
                },
                {
                    model: UsersEducationDetail,
                    as: 'education_details',
                },
                {
                    model: UsersDocument,
                    as: 'user_documents',
                },
                {
                    model: UsersBankDetail,
                    as: 'bank_details',
                },
                {
                    model: UserSalaryStructure,
                    as: 'salary_structure',
                },



            ],
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ user })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });

    }

};


module.exports.updateAllUserDetails = async (req, res) => {
    const { id, user, personal_details, bank_details, salary_structure } = req.body;
    try {
        // Validate user input data
        const existingUser = await UserModel.findByPk(id);
        if (!existingUser) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Update user data
        await UserModel.update(user, { where: { id } });

        // Update user personal details
        await UsersPersonalDetail.update(personal_details, { where: { user_id: id } });

        // Update user bank details
        await UsersBankDetail.update(bank_details, { where: { user_id: id } });

        // Update user salary structure
        await UserSalaryStructure.update(salary_structure, { where: { user_id: id } });

        res.status(200).json({ message: 'User details updated successfully.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }


}