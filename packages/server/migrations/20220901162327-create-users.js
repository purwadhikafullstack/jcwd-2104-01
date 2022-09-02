'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      userId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      email: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      first_name: Sequelize.STRING(20),
      last_name: Sequelize.STRING(20),
      birthDate: Sequelize.DATE,
      image: {
        type: Sequelize.STRING(100),
        defaultValue: '/public/user/default-avatar.png',
      },
      gender: Sequelize.ENUM('Male', 'Female'),
      phone: Sequelize.STRING(13),
      password: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      token: Sequelize.STRING(100),
      isVerified: {
        type: Sequelize.TINYINT(1),
        allowNull: false,
        defaultValue: '0',
      },
      isAdmin: {
        type: Sequelize.TINYINT(1),
        allowNull: false,
        defaultValue: '0',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
        ),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  },
};
