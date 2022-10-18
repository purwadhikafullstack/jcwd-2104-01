const express = require('express');
const router = express.Router();
const { Op, Sequelize } = require('sequelize');
const moment = require('moment');
const {
  Address,
  transaction,
  detailTransaction,
  product,
  logHistory,
} = require('../../../models');

const allTransactionProduct = async (req, res, next) => {
  try {
    const {
      createdAt = new Date().getTime(),
      page = 1,
      pageSize = 4,
      sorting = 'createdAt',
      order = 'ASC',
    } = req.query;

    const limit = Number(pageSize);
    const offset = (Number(page) - 1) * Number(pageSize);

    var endDate = new Date(moment(createdAt).add(1, 'M').format('MM-DD-YYYY'));

    const getLogHistory = await logHistory.findAndCountAll({
      order: Sequelize.literal(`${sorting} ${order}`),
      where: {
        status: 'out',
        createdAt: createdAt
          ? { [Op.between]: [createdAt, endDate] }
          : { [Op.or]: null },
      },
      attributes: [
        'historyId',
        'userId',
        'productId',
        'quantity',
        'totalPrice',
        'createdAt',
      ],
      include: [
        {
          model: product,

          attributes: [
            'productId',
            'productName',
            'productImage',
            'price',
            'unit',
            'stock',
            'desc',
          ],
        },
      ],
      offset,
      limit,
    });

    res.send({
      status: 'Succsess',
      message: 'Data Product Transactionsssss',
      data: {
        getTransactProduct: getLogHistory.rows,
        totalPage: getLogHistory.count,
      },
    });
  } catch (error) {
    next(error);
    console.log(error);
  }
};
const allTransactionProductNorm = async (req, res, next) => {
  try {
    const {
      page = 1,
      pageSize = 4,
      sorting = 'createdAt',
      order = 'ASC',
    } = req.query;

    const limit = Number(pageSize);
    const offset = (Number(page) - 1) * Number(pageSize);

    const getLogHistory = await logHistory.findAndCountAll({
      order: Sequelize.literal(`${sorting} ${order}`),
      where: {
        status: 'out',
      },
      attributes: [
        'historyId',
        'userId',
        'productId',
        'quantity',
        'totalPrice',
        'createdAt',
      ],
      include: [
        {
          model: product,

          attributes: [
            'productId',
            'productName',
            'productImage',
            'price',
            'unit',
            'stock',
            'desc',
          ],
        },
      ],
      offset,
      limit,
    });

    res.send({
      status: 'Succsess',
      message: 'Data Product Transactionsssss',
      data: {
        getTransactProduct: getLogHistory.rows,
        totalPage1: getLogHistory.count,
      },
    });
  } catch (error) {
    next(error);
    console.log(error);
  }
};
router.get('/productTransaction', allTransactionProduct);
router.get('/productTransaction1', allTransactionProductNorm);
module.exports = router;
