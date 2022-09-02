'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transactions', {
      transactionId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'userId',
        },
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'products',
          key: 'productId',
        },
      },
      addressId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'addresses',
          key: 'addressId',
        },
      },
      total: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      transactionStatus: {
        type: Sequelize.ENUM(
          'Menuggu Pembayaran',
          'Menuggu Konfirmasi Pembayaran',
          'Diproses',
          'Dibatalkan',
          'Dikirim',
          'Pesanan Dikonfirmasi',
        ),
      },
      paymentProof: {
        type: Sequelize.STRING(100),
        defaultValue: '/public/user/default-avatar.png',
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
    await queryInterface.dropTable('transactions');
  },
};
