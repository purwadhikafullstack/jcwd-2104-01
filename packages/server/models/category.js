'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      category.belongsToMany(models.product, { through: 'productCategory' });
    }
  }
  category.init(
    {
      categoryId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      category: DataTypes.STRING(30),
    },
    {
      sequelize,
      modelName: 'category',
      tableName: 'categories',
    },
  );
  return category;
};
