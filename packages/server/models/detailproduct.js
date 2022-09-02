'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class detailProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      detailProduct.belongsTo(models.product, { foreignKey: 'productId' });
    }
  }
  detailProduct.init(
    {
      dpId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'products',
          key: 'productId',
        },
      },
      quantity: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      currentQuantity: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      isOpen: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
        defaultValue: '0',
      },
      isAvailable: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
        defaultValue: '0',
      },
    },
    {
      sequelize,
      modelName: 'detailProduct',
      tableName: 'detailProducts',
    },
  );
  return detailProduct;
};
