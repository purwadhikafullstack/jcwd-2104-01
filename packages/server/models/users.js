'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user.hasMany(models.address, { foreignKey: 'userId' });
      user.hasMany(models.cart, { foreignKey: 'userId' });
      user.hasMany(models.prescription, { foreignKey: 'userId' });
      user.hasMany(models.transaction, { foreignKey: 'userId' });
      user.hasMany(models.logHistory, { foreignKey: 'userId' });
    }
  }
  user.init(
    {
      userId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      first_name: DataTypes.STRING(20),
      last_name: DataTypes.STRING(20),
      birthDate: DataTypes.DATE,
      image: {
        type: DataTypes.STRING(100),
        defaultValue: '/public/user/default-avatar.png',
      },
      gender: DataTypes.ENUM('Male', 'Female'),
      phone: DataTypes.STRING(13),
      password: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      token: DataTypes.STRING(100),
      isVerified: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
        defaultValue: '0',
      },
      isAdmin: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
        defaultValue: '0',
      },
    },
    {
      sequelize,
      modelName: 'user',
      tableName: 'users',
    },
  );
  return user;
};
