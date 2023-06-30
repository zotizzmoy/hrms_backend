//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//IMPORT THINGS ON THE TOP
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const express = require("express");
const router = express.Router();
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const { upload, compressImage } = require('../middleware/upload_middleware');
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const AuthController = require('../controllers/AuthController');
const AttendanceController = require('../controllers/AttendanceController');
const LeaveController = require('../controllers/LeaveController');
const AdminController = require('../controllers/AdminController');
const HolidayController = require('../controllers/HolidayController');





//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//AuthController
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
router.route('/otp').post(AuthController.otp);
router.route('/login').post(AuthController.login);
router.route("/register").post(AuthController.register);
router.route("/update").post(AuthController.update)
router.post("/profile-img", upload.single('user_image'), compressImage, AuthController.profileImage); // Different route method is used for image upload
router.route("/get-profile-url").post(AuthController.user_image);
router.route('/resend-otp').post(AuthController.resend_opt);
router.route('/change-password').post(AuthController.change_password);

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//AttendanceController
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
router.route('/add-attendance').post(AttendanceController.addAttendance);
router.route('/list-attendance').post(AttendanceController.listAttendance);
router.route('/list-all-attendance').post(AttendanceController.listAllAttendance);
router.route('/add-activities').post(AttendanceController.addActivities);
router.route('/monthly-attendance-count').post(AttendanceController.countAttendanceBymonth);
router.route('/monthly-late-users-count').post(AttendanceController.countLateUsersBymonth);



//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//AdminController
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
router.route('/admin-login').post(AdminController.Adminlogin);
router.route('/all-employee').post(AdminController.allEmployee);
router.route('/all-registered-employee').post(AdminController.allEmployeeCount);
router.route('/daily-attendance-count').post(AdminController.countAttendanceOnDate);
router.route('/find-attendance').post(AdminController.attendanceExporter);
router.route('/attendance-on-date').post(AdminController.latestAttendance);
router.route('/activity-on-date').post(AdminController.activityExporter);
router.route("/late-users").post(AdminController.countLateUsers);
router.route("/late-users-get").post(AdminController.LateUsers);
router.route("/delete-user").post(AdminController.deleteUser);
router.route("/clean-attendance").post(AdminController.cleanAttendance);
router.route("/clean-activity").post(AdminController.cleanActivity);
router.route("/daily-absent-count").post(AdminController.countAbsentUsers);
router.route("/daily-absent-users").post(AdminController.findAbsentUsers);
router.route("/attendance-by-user").post(AdminController.UserattendanceExporter);
router.route("/activity-by-user").post(AdminController.UseractivityExporter);
router.route("/leave-applied-users").post(AdminController.leaveRequests);
router.route("/count-leave-applied").post(AdminController.leaveCountForSevenDays);
router.route("/on-leave-today").post(AdminController.onleaveCount);
router.route("/all-leave-balance").post(AdminController.calculateAllUsersleaveBalance);

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//LeaveController
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
router.route('/apply-leave').post(LeaveController.applyLeave);
router.route('/calculate-leave').post(LeaveController.calculateLeaves);
router.post("/upload-document", upload.single('document'), compressImage, LeaveController.uploadDocument); // Different route method is used for image upload
router.post("/approved-leave", LeaveController.changeStatus);
router.post("/cancel-leave", LeaveController.cancelledStatus);
router.post("/get-all-leaves", LeaveController.getAllleaves);

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//HolidayController
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
router.route('/all-holidays').get(HolidayController.getHolidays);
router.route('/create-holiday').post(HolidayController.createHoliday);
router.route('/update-holiday/:id').post(HolidayController.updateHoliday);
router.route('/delete-holiday/:id').post(HolidayController.deleteHoliday);
router.route('/upcoming-holiday').post(HolidayController.upcomingHoliday);















//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports = router;
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++