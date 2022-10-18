const express = require('express');
const router = express.Router();
const {
  product,
  detailProduct,
  productCategory,
  logHistory,
  sequelize,
} = require('../../../models');
const fs = require('fs');
const path = require('path');
const appRoot = require('app-root-path');

const deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const postPath = path.join(appRoot.path, 'packages', 'server');
    const resGetProduct = await product.findOne({ where: { productId } });

    const result = await sequelize.transaction(async (t) => {
      await detailProduct.destroy({ where: { productId } }, { transaction: t });

      await productCategory.destroy(
        { where: { productId } },
        { transaction: t },
      );

      const resDeleteProduct = await product.destroy(
        { where: { productId } },
        { transaction: t },
      );

      return resDeleteProduct;
    });

    if (!result) {
      throw { code: 400, message: 'Gagal hapus produk' };
    }

    const { dataValues } = resGetProduct;

    const paths = postPath + dataValues.productImage;

    if (dataValues.productImage.split('/')[3] != 'default-product.png') {
      fs.unlink(paths, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    }

    res.send({
      status: 'Berhasil',
      message: 'Berhasil hapus produk',
    });
  } catch (error) {
    next(error);
  }
};

const deleteUpdateProductStock = async (req, res, next) => {
  try {
    const { historyId } = req.params;
    const resGetLoghistory = await logHistory.findOne({
      where: { historyId },
      attributes: ['quantity', 'productId'],
    });
    const productId = resGetLoghistory.dataValues.productId;
    const resGetProduct = await product.findOne({
      where: { productId },
      attributes: ['stock'],
    });
    const newStock =
      resGetProduct.dataValues.stock - resGetLoghistory.dataValues.quantity;

    const result = await sequelize.transaction(async (t) => {
      await product.update(
        { stock: newStock },
        { where: { productId } },
        { transaction: t },
      );

      const resDeleteUpdateStock = await logHistory.destroy(
        { where: { historyId } },
        { transaction: t },
      );

      return resDeleteUpdateStock;
    });

    res.send({
      status: 'Berhasil',
      message: 'Berhasil hapus update stok produk',
    });
  } catch (error) {
    next(error);
  }
};

router.delete('/:productId', deleteProduct);
router.delete('/stock/:historyId', deleteUpdateProductStock);

module.exports = router;
