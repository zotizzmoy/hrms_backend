//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//IMPORT THINGS ON THE TOP
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const { Sequelize, DataTypes } = require("sequelize");
const sequelize_db = require("../config/mysqlORM");
const UserAttendence = require("./UsersAttendence");
const UserActivity = require("./UsersActivity");
const UserLeave = require("./UsersLeave");
const UserSalaryStructure = require("./UsersSalaryStructure");
const UserSalary = require("./UsersSalary");
const UsersPersonalDetail = require("./UsersPersonalDetail");
const UsersEducationDetail = require("./UsersEducation");
const UsersDocument = require("./UsersDocument");
const UsersBankDetail = require("./UsersBankDetail");


//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//MODEL DETAILS
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const UserModel = sequelize_db.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    emp_id: {
      type: DataTypes.STRING,
    },
    first_name: {
      type: DataTypes.STRING,
    },
    last_name: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    designation: {
      type: DataTypes.STRING
    },

    password: {
      type: DataTypes.STRING,
    },
    user_image: {
      type: DataTypes.TEXT,
    },
  
    dob: {
      type: DataTypes.STRING
    },
    date_of_joining:{
      type: DataTypes.STRING
    },
    gender: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.STRING,
    },

    paid_leaves: {
      type: DataTypes.INTEGER
    },
    role: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    label: {
      type: DataTypes.STRING
    },

    created_at: {
      type: DataTypes.DATE,
    },
    updated_at: {
      type: DataTypes.DATE,
    },
    deleted_at: {
      type: DataTypes.DATE,
    },
  },
  {
    timestamps: false,
    underscored: true,
    paranoid: true,
    deletedAt: "deleted_at",
  }
);

// Associations 

UserModel.hasMany(UserAttendence, {
  foreignKey: "user_id", // The foreign key in the UserAttendence model referencing UserModel
  as: "attendances" // Alias for the association
});
UserAttendence.belongsTo(UserModel, {
  foreignKey: "user_id" // The foreign key in the UserAttendence model referencing UserModel
});

UserModel.hasMany(UserActivity, {
  foreignKey: "user_id", // The foreign key in the UserAttendence model referencing UserModel
  as: "activities" // Alias for the association
});
UserActivity.belongsTo(UserModel, {
  foreignKey: "user_id" // The foreign key in the UserAttendence model referencing UserModel
});

UserModel.hasMany(UserLeave, {
  foreignkey: "user_id",
  as: "leaves"
});
UserLeave.belongsTo(UserModel, {
  foreignkey: "user_id"
});

UserModel.hasOne(UserSalaryStructure, {
  foreignKey: "user_id",
  as: "salary_structure"
});
UserSalaryStructure.belongsTo(UserModel, {
  foreignKey: "user_id"
});

UserModel.hasMany(UserSalary, {
  foreignKey: "user_id",
  as: "salary"
})
UserSalary.belongsTo(UserModel, {
  foreignKey: "user_id",

});

UserModel.hasMany(UsersPersonalDetail, {
  foreignKey: "user_id",
  as: "personal_details"
});

UsersPersonalDetail.belongsTo(UserModel, {
  foreignKey: "user_id",
});

UserModel.hasMany(UsersEducationDetail, {
  foreignKey: "user_id",
  as: "education_details"
});

UsersEducationDetail.belongsTo(UserModel, {
  foreignKey: "user_id"
});

UserModel.hasOne(UsersBankDetail, {
  foreignKey: "user_id",
  as: "bank_details"
});
UsersBankDetail.belongsTo(UserModel, {
  foreignKey: "user_id"
});

UserModel.hasMany(UsersDocument, {
  foreignKey: "user_id",
  as: "user_documents"
});
UsersDocument.belongsTo(UserModel, {
  foreignKey: "user_id"
});



//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports = UserModel;
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
