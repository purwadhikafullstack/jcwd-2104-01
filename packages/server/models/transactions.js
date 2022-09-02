'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      transaction.hasOne(models.address, { foreignKey: 'transactionId' });
      transaction.belongsTo(models.user, { foreignKey: 'userId' });
      transaction.hasMany(models.detailTransaction, {
        foreignKey: 'transactionId',
      });
      transaction.hasMany(models.product, {
        foreignKey: 'transactionId',
      });
    }
  }
  transaction.init(
    {
      transactionId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'userId',
        },
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'products',
          key: 'productId',
        },
      },
      addressId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'addresses',
          key: 'addressId',
        },
      },
      total: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      transactionStatus: {
        type: DataTypes.ENUM(
          'Menuggu Pembayaran',
          'Menuggu Konfirmasi Pembayaran',
          'Diproses',
          'Dibatalkan',
          'Dikirim',
          'Pesanan Dikonfirmasi',
        ),
      },
      paymentProof: {
        type: DataTypes.STRING(100),
        defaultValue: '/public/user/default-avatar.png',
      },
    },
    {
      sequelize,
      modelName: 'transaction',
      tableName: 'transactions',
    },
  );
  return transaction;
};
