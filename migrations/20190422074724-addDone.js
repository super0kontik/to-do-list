'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      "Tasks",
      'done',
      {
        type:Sequelize.BOOLEAN,
        defaultValue:false
      }
    );
  },
down: function (queryInterface, Sequelize) {
  return queryInterface.removeColumn("Tasks", 'done');
}
};
