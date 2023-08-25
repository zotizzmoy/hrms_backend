const UserModel = require("../models/Users");
const userSalaryStructure = require("../models/UsersSalaryStructure");
const dayjs = require("dayjs");

module.exports.getLeaveDeductions = async (req, res) => {
    const { userId, startDate, endDate, usePaidLeave, isHalfDay } = req.body;

    try {

        const Salary = await userSalaryStructure.findOne({
            where: {
                user_id: userId
            }
        });

        const basicSalary = Salary.basic;
        const daysInStartMonth = dayjs(startDate).daysInMonth();

        // Calculate duration between start and end date in days
        const start = dayjs(startDate);
        const end = dayjs(endDate);
        const durationInDays = end.diff(start, 'days') + 1; // Including both start and end days

        // Calculate leave deduction based on usePaidLeave flag and isHalfDay
        let leaveDeduction;
        if (isHalfDay) {
            leaveDeduction = Math.round(0.5 * (basicSalary / daysInStartMonth));
        } else {
            const startMonth = dayjs(startDate).format('MM');
            leaveDeduction = Math.round((basicSalary / daysInStartMonth)) * durationInDays;
        }
        if (usePaidLeave) {
            leaveDeduction = 0; // No deductions if leave is paid
        }


        res.status(200).json({ leaveDeduction });
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ error: 'An error occurred while calculating leave deductions' });
    }
};





module.exports.getLeaveBalance = async (req, res) => {
    const { user_id } = req.body;
    try {
        const paidleaveBalance = await UserModel.findOne({
            where: {
                id: user_id
            }
        });

        const balance = paidleaveBalance.paid_leaves;

        res.status(200).json(balance);

    } catch (error) {
        res.status(500)(error.message);
    }

};

