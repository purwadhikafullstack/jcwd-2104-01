'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('detailProducts', {
      dpId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'products',
          key: 'productId',
        },
      },
      quantity: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      currentQuantity: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      isOpen: {
        type: Sequelize.TINYINT(1),
        allowNull: false,
        defaultValue: '0',
      },
      isAvailable: {
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
    await queryInterface.dropTable('detailProducts');
  },
};
