//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//IMPORT THINGS ON THE TOP
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const express = require("express");
const router = express.Router();
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const moment = require("moment");
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Helper
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const helper = require("../helper/helper.js");
const { Op, Sequelize } = require('sequelize');
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Model
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const UserAttendence = require("../models/UsersAttendence");
const UserActivity = require("../models/UsersActivity");
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Route IN-OUT ATTENDANCE
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.addAttendance = async function (req, res) {
  let resData = {
    status: false,
    data: {},
    message: "",
  };
  try {
    //+++++++++++++++++++++++++++++++++++++++++++++++++++
    let user_id = null;
    if (req.body.user_id) {
      user_id = parseInt(req.body.user_id, 10) || "";
    }
    let date = null;
    if (req.body.user_id) {
      date = req.body.date;
    }
    let time = null;
    if (req.body.user_id) {
      time = req.body.time;
    }
    let location = null;
    if (req.body.location) {
      location = req.body.location;
    }
    let msg = req.body.msg;
    //+++++++++++++++++++++++++++++++++++++++++++++++++++
    if (!user_id) {
      resData.message = "User ID Is Required";
      return res.status(200).json(resData);
    }
    if (!date) {
      resData.message = "Date Is Required";
      return res.status(200).json(resData);
    }
    if (!time) {
      resData.message = "Time Is Required";
      return res.status(200).json(resData);
    }
    if (!location) {
      resData.message = "Location Is Required";
      return res.status(200).json(resData);
    }
    //+++++++++++++++++++++++++++++++++++++++++++++++++++
    date = new Date(date);
    date = moment(date).format("YYYY-MM-DD");
    //+++++++++++++++++++++++++++++++++++++++++++++++++++
    const return_q_promis = UserAttendence.count({
      where: {
        user_id: user_id,
        in_date: date,
      },
    });
    //+++++++++++++++++++++++++++++++++++++++++
    return_q_promis.then((r_obj) => {
      if (r_obj == 0) {
        //+++++++++++++++++++++++++++++++++++++++++
        let main_data = {
          user_id: user_id,
          location: location,
          in_date: date,
          in_distance: req.body.in_distance,
          status: req.body.status,
          in_time: time,
          attendance_status: 'present',
          in_office: req.body.in_office,
          msg: msg,
          created_at: new Date(),
        };
        UserAttendence.create(main_data)
          .then(async (obj) => {
            //+++++++++++++++++++++++++++++++++++++++++
            resData.data.data_processing = await UserAttendence.findByPk(
              obj.id
            );
            //+++++++++++++++++++++++++++++++++++++++++
            resData.status = true;
            resData.message = "Thank You For Your Attendance-IN";
            return res.status(200).json(resData);
          })
          .catch((obj_error) => {
            //+++++++++++++++++++++++++++++++++++++++++
            resData.status = false;
            resData.data.data_processing = obj_error;
            resData.message =
              "Sorry!! Something Went Wrong. Please Try After Sometime.";
            return res.status(200).json(resData);
          });
      } else {
        //+++++++++++++++++++++++++++++++++++++++++
        const return_q_promis_2 = UserAttendence.findAndCountAll({
          where: {
            user_id: user_id,
            in_date: date,
          },
        });
        //+++++++++++++++++++++++++++++++++++++++++
        return_q_promis_2
          .then(async (r_obj) => {
            if (r_obj.rows[0]) {
              //+++++++++++++++++++++++++++++++++++++++++
              let main_data = {
                out_date: date,
                out_time: time,
                out_distance: req.body.out_distance,
                activity: req.body.activity,
                out_office: req.body.out_office,

                updated_at: new Date(),
              };
              //+++++++++++++++++++++++++++++++++++++++++
              UserAttendence.update(main_data, {
                where: {
                  user_id: user_id,
                  in_date: date,
                },
              })
                .then(async (obj) => {
                  //+++++++++++++++++++++++++++++++++++++++++
                  resData.data.data_processing = await UserAttendence.findByPk(
                    r_obj.rows[0].id
                  );
                  //+++++++++++++++++++++++++++++++++++++++++
                  resData.status = true;
                  resData.message = "Thank You For Your Attendance-OUT";
                  return res.status(200).json(resData);
                })
                .catch((obj_error) => {
                  //+++++++++++++++++++++++++++++++++++++++++
                  console.log(obj_error);
                  //+++++++++++++++++++++++++++++++++++++++++
                  resData.status = false;
                  resData.data.data_processing = obj_error;
                  resData.message =
                    "Sorry!! Something Went Wrong. Please Try After Sometime.";
                  return res.status(200).json(resData);
                });
            } else {
              resData.status = true;
              resData.data.data_processing = await UserAttendence.findByPk(
                r_obj.rows[0].id
              );
              resData.message = "Data Alreday Processed";
              return res.status(200).json(resData);
            }
          })
          .catch((obj_error) => {
            //+++++++++++++++++++++++++++++++++++++++++
            console.log(obj_error);
            //+++++++++++++++++++++++++++++++++++++++++
            resData.status = false;
            resData.data.data_processing = obj_error;
            resData.message =
              "Sorry!! Something Went Wrong. Please Try After Sometime.";
            return res.status(200).json(resData);
          });
      }
    });
    //+++++++++++++++++++++++++++++++++++++++++
  } catch (e) {
    console.log(e);
    resData.status = false;
    resData.message = "Error!!";
    resData.data = e;
    res.status(601).json(resData);
  }
};

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Route LIST ALL ATTENDANCE
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.listAllAttendance = async function (req, res) {
  let resData = {
    status: false,
    data: {},
    message: "",
  };
  try {
    //+++++++++++++++++++++++++++++++++++++++++++++++++++
    let user_id = null;
    if (req.body.user_id) {
      user_id = parseInt(req.body.user_id, 10) || "";
    }
    //+++++++++++++++++++++++++++++++++++++++++++++++++++
    if (!user_id) {
      resData.message = "User ID Is Required";
      return res.status(200).json(resData);
    }
    //+++++++++++++++++++++++++++++++++++++++++++++++++++
    const return_q_promis = UserAttendence.findAll({
      where: {
        user_id: user_id,
      },
    });
    //+++++++++++++++++++++++++++++++++++++++++
    return_q_promis.then((r_obj) => {
      //+++++++++++++++++++++++++++++++++++++++++
      resData.data.data_processing = r_obj;
      //+++++++++++++++++++++++++++++++++++++++++
      resData.status = true;
      resData.message = "Attendance List";
      return res.status(200).json(resData);
    });
    //+++++++++++++++++++++++++++++++++++++++++
  } catch (e) {
    console.log(e);
    resData.status = false;
    resData.message = "Error!!";
    resData.data = e;
    res.status(601).json(resData);
  }
};
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Route LIST ATTENDANCE
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.listAttendance = async function (req, res) {
  let resData = {
    status: false,
    data: {},
    message: "",
  };
  try {
    //+++++++++++++++++++++++++++++++++++++++++++++++++++
    let user_id = null;
    if (req.body.user_id) {
      user_id = parseInt(req.body.user_id, 10) || "";
    }
    let date = new Date();
    if (req.body.date) {
      date = req.body.date;
    }
    //+++++++++++++++++++++++++++++++++++++++++++++++++++
    if (!user_id) {
      resData.message = "User ID Is Required";
      return res.status(200).json(resData);
    }
    //+++++++++++++++++++++++++++++++++++++++++++++++++++
    date = new Date(date);
    date = moment(date).format("YYYY-MM-DD");
    //+++++++++++++++++++++++++++++++++++++++++++++++++++
    const return_q_promis = UserAttendence.findAll({
      where: {
        user_id: user_id,
        in_date: date,
      },
    });
    //+++++++++++++++++++++++++++++++++++++++++
    return_q_promis.then((r_obj) => {
      //+++++++++++++++++++++++++++++++++++++++++
      resData.data.data_processing = r_obj;
      //+++++++++++++++++++++++++++++++++++++++++
      resData.status = true;
      resData.message = "Attendance Details";
      return res.status(200).json(resData);
    });
    //+++++++++++++++++++++++++++++++++++++++++
  } catch (e) {
    console.log(e);
    resData.status = false;
    resData.message = "Error!!";
    resData.data = e;
    res.status(601).json(resData);
  }
};


module.exports.addActivities = async function (req, res) {
  try {
    const { user_id, activity } = req.body;

    let activitiesToCreate = [];

    for (let i = 0; i < activity.length; i++) {
      if (activity[i]) {
        const object = {
          user_id: user_id,
          date: moment().format("YYYY-MM-DD"),
          activity: activity[i],
        };
        activitiesToCreate.push(object);
      } else {
        console.log('null');
      }
    }

    if (activitiesToCreate.length > 0) {
      await UserActivity.bulkCreate(activitiesToCreate);
    }

    const userActivities = await UserActivity.findOne({
      where: { user_id },
    });

    res.status(200).json({
      data: userActivities,
    });

  } catch (error) {
    res.status(500).send(error.message);
  }
};



module.exports.countAttendanceBymonth = async function (req, res) {
  const { user_id, year, month } = req.body;
  const startDate = new Date(year, month - 1, 1); // Note: JavaScript months are 0-based
  const endDate = new Date(year, month, 0);
  try {
    const attendance = await UserAttendence.count({
      where: {
        user_id: user_id,
        status: 'on time',
        in_date: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).send(error.message);
  }

};

module.exports.countLateUsersBymonth = async function (req, res) {
  const { user_id, year, month } = req.body;
  const startDate = new Date(year, month - 1, 1); // Note: JavaScript months are 0-based
  const endDate = new Date(year, month, 0);
  try {
    const attendance = await UserAttendence.count({
      where: {
        user_id: user_id,
        status: 'late',
        in_date: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).send(error.message);
  }


};