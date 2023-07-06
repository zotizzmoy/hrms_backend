const generateSalary = async (req, res) => {
    try {
      // Extract the necessary data from the request body
      const { basic, hra, conveyance, specialAllowance, bonus, performanceAllowance, leaves, lateComing, month, year } = req.body;
  
      // Fetch all users from the database
      const userModel = require('../path/to/userModel'); // Update the path to the user model file if necessary
      const users = await userModel.findAll();
  
      // Array to store the newly created salary records
      const newSalaries = [];
  
      // Generate salary record for each user
      for (const user of users) {
        const userId = user.id;
  
        // Calculate the gross monthly amount
        const grossMonthlyAmount = basic + hra + conveyance + specialAllowance;
  
        // Calculate the deductions
        const workingDaysDeduction = (basic / workingDays) * (workingDays - leaves);
        const lateComingDeduction = (basic / workingDays) * lateComing;
  
        // Calculate the net salary
        const netSalary = grossMonthlyAmount - workingDaysDeduction - lateComingDeduction;
  
        // Create a new salary record in the database
        const newSalary = await userSalaryStructure.create({
          user_id: userId,
          basic,
          hra,
          conveyance,
          special_allowance: specialAllowance,
          gross_monthly_amount: grossMonthlyAmount,
          bonus,
          performance_allowance: performanceAllowance,
          deductions_working_days: workingDaysDeduction,
          deductions_late_coming: lateComingDeduction,
          net_salary: netSalary,
          month,
          year,
          created_at: new Date(),
          updated_at: new Date()
        });
  
        newSalaries.push(newSalary);
      }
  
      // Return the newly created salary records
      res.json(newSalaries);
    } catch (error) {
      // Handle any errors that occur during the salary generation process
      console.error(error);
      res.status(500).json({ error: 'An error occurred during salary generation.' });
    }
  };
  