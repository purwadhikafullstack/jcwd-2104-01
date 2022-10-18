'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Address.belongsTo(models.user, { foreignKey: 'userId' });
      Address.hasMany(models.transaction, { foreignKey: 'addressId' });
    }
  }
  Address.init(
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
      province: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      province_id: {
        type: DataTypes.STRING(5),
        allowNull: true,
      },
      city_name: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      city_id: {
        type: DataTypes.STRING(5),
        allowNull: true,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Address',
      tableName: 'addresses',
      paranoid: true,
    },
  );
  return Address;
};
