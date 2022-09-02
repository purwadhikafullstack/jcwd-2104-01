'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      address.belongsTo(models.user, { foreignKey: 'userId' });
      address.belongsTo(models.transaction, { foreignKey: 'transactionId' });
    }
  }
  address.init(
    {
      addressId: {
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
      address: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      isMain: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
        defaultValue: '0',
      },
    },
    {
      sequelize,
      modelName: 'address',
      tableName: 'addresses',
    },
  );
  return address;
};
