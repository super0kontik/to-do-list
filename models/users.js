'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    access: {
        type: DataTypes.INTEGER,
        defaultValue:1
    },
    password:{
      type: DataTypes.STRING
    },
    accessToken:{
      type: DataTypes.STRING
    },
    refreshToken:{
      type: DataTypes.STRING
    }
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Task)
  };
  return User;
};
