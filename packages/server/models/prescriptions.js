'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class prescription extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      prescription.belongsTo(models.user, { foreignKey: 'userId' });
    }
  }
  prescription.init(
    {
      prescriptionId: {
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
      prescriptionImage: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('rejected', 'processed'),
      },
    },
    {
      sequelize,
      modelName: 'prescription',
      tableName: 'prescriptions',
    },
  );
  return prescription;
};
