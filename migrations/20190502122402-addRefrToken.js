'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      "Users",
      'refreshToken',
      {
        type:Sequelize.STRING,
      }
    );
  },
down: function (queryInterface, Sequelize) {
  return queryInterface.removeColumn("Users", 'refreshToken');
}
};
