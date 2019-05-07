'use strict';
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    content: {
        type: DataTypes.STRING,
        allowNull: false
    },
    done:{
      type: DataTypes.BOOLEAN,
      defaultValue:false
    }
  }, {});
  Task.associate = function(models) {
    // associations can be defined here
    Task.belongsTo(models.User)
  };
  return Task;
};
