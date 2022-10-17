const express = require('express');
const router = express.Router();
const moment = require('moment');
// const Sequelize = require('sequelize');
const { Op, Sequelize } = require('sequelize');

const {
  transaction,
  cart,
  product,
  address,
  detailTransaction,
  logHistory,
} = require('../../../models');
const { auth } = require('../../helpers/auth');

const confirmTransaction = async (req, res, next) => {
  try {
    const { transactionId } = req.query;

    const findTransaction = await transaction.findAll({
      where: { transactionId },
    });
    const getDTData = await detailTransaction.findAndCountAll({
      where: { transactionId },
      attributes: ['dtId', 'productId', 'quantity'],
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
        {
          model: transaction,
          attributes: [
            'userId',
            'transactionId',
            'addressId',
            'total',
            'transactionStatus',
            'createdAt',
            'kurir',
            'biaya',
            'estimasi',
          ],
        },
      ],
    });

    let totalPrice;
    findTransaction.forEach((data) => {
      totalPrice = data.dataValues.total;
    });

    getDTData.rows.map(async (data) => {
      const updateProduct = await product.findOne({
        where: { productId: data.dataValues.productId },
      });

      console.log(updateProduct.dataValues.price);
      await logHistory.create({
        userId: data.dataValues.transaction.dataValues.userId,
        productId: data.dataValues.productId,
        quantity: data.dataValues.quantity,
        totalPrice: updateProduct.dataValues.price * data.dataValues.quantity,
        status: 'out',
        type: 'Penjualan',
      });
    });

    const sendTransaction = await transaction.update(
      { transactionStatus: 'Diproses' },
      {
        where: {
          transactionId: transactionId,
        },
      },
    );

    const updatedTransaction = await transaction.findAll({
      where: { transactionId },
    });

    res.send({
      status: 'Succsess',
      message: 'Finish Transaction',
      data: {
        updatedTransaction,
      },
    });
  } catch (error) {
    next(error);
    console.log(error);
  }
};
const sendOrder = async (req, res, next) => {
  try {
    const { transactionId } = req.query;

    const findTransaction = await transaction.findAll({
      where: { transactionId },
    });

    const sendTransaction = await transaction.update(
      { transactionStatus: 'Dikirim' },
      {
        where: {
          transactionId: transactionId,
        },
      },
    );

    const updatedTransaction = await transaction.findAll({
      where: { transactionId },
    });
    res.send({
      status: 'Succsess',
      message: 'Send Transaction',
      data: {
        updatedTransaction,
      },
    });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

const cancelTransaction = async (req, res, next) => {
  try {
    const { transactionId } = req.query;

    const { userId } = req.user;

    const findTransaction = await transaction.findAll({
      where: { transactionId },
    });
    // console.log(findTransaction);
    const getDTData = await detailTransaction.findAndCountAll({
      where: { transactionId },
      attributes: ['dtId', 'productId', 'quantity'],
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
        {
          model: transaction,
          attributes: [
            'userId',
            'transactionId',
            'addressId',
            'total',
            'transactionStatus',
            'createdAt',
            'kurir',
            'biaya',
            'estimasi',
          ],
        },
      ],
    });

    let totalPrice;
    findTransaction.map((data) => {
      totalPrice = data.dataValues.total;
    });

    const sendTransaction = await transaction.update(
      { transactionStatus: 'Menunggu Pembayaran' },
      {
        where: {
          transactionId: transactionId,
        },
      },
    );

    const updatedTransaction = await transaction.findAll({
      where: { transactionId },
    });

    res.send({
      status: 'Succsess',
      message: 'Cancel Transaction',
      data: {
        updatedTransaction,
      },
    });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

const SalesItem = async (req, res, next) => {
  const { timeReport = 'Bulanan' } = req.body;
  let results, metadata;
  try {
    if (timeReport === 'Mingguan') {
      [results, metadata] = await logHistory.sequelize.query(
        'SELECT WEEK(createdAt) as `week`, sum(`quantity`) AS `sum_quantity` FROM `logHistories` AS `Transaction_items` GROUP BY WEEK(createdAt) ORDER BY WEEK(createdAt) ASC',
      );
    } else if (timeReport === 'Bulanan') {
      [results, metadata] = await logHistory.sequelize.query(
        'SELECT createdAt as `month`, sum(`quantity`) AS `sum_quantity` FROM `logHistories` AS `Transaction_items` WHERE YEAR (createdAt) = ' +
          moment().format('YYYY') +
          ' GROUP BY MONTH(createdAt) ORDER BY MONTH(createdAt) ASC',
      );
    } else if (timeReport === 'Tahunan') {
      [results, metadata] = await logHistory.sequelize.query(
        'SELECT createdAt as `year`, sum(`quantity`) AS `sum_quantity` FROM `logHistories` AS `Transaction_items` GROUP BY YEAR(createdAt) ORDER BY YEAR(createdAt) ASC',
      );
    }
    let data = { results };
    res.send({
      status: 'Succsess',
      message: 'Sales Report',
      data: {
        data,
      },
    });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

const ProfitReport = async (req, res, next) => {
  const { timeReport = 'Bulanan' } = req.body;
  let SaleTotal, metadata;
  try {
    if (timeReport === 'Mingguan') {
      const [resultsSaleTotal, metadata] = await logHistory.sequelize.query(
        'SELECT WEEK(createdAt) as `week`, sum(totalPrice) AS `sum` FROM `logHistories` AS `Total` GROUP BY WEEK(createdAt) ORDER BY WEEK(createdAt) ASC',
      );
      SaleTotal = resultsSaleTotal;
    } else if (timeReport === 'Bulanan') {
      const [resultsSaleTotal, metadata] = await logHistory.sequelize.query(
        'SELECT createdAt as `month`, sum(totalPrice) AS `sum` FROM `logHistories` AS `Total` WHERE YEAR (createdAt) = ' +
          moment().format('YYYY') +
          ' GROUP BY MONTH(createdAt) ORDER BY MONTH(createdAt) ASC',
      );
      SaleTotal = resultsSaleTotal;
    } else if (timeReport === 'Tahunan') {
      const [resultsSaleTotal, metadata] = await logHistory.sequelize.query(
        'SELECT createdAt as `year`, sum(totalPrice) AS `sum` FROM `logHistories` AS `Total` GROUP BY YEAR(createdAt) ORDER BY YEAR(createdAt) ASC',
      );
      SaleTotal = resultsSaleTotal;
    }
    let data = { SaleTotal };
    res.send({
      status: 'Succsess',
      message: 'Sales Report',
      data: {
        data,
      },
    });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

const CountTransactionReport = async (req, res, next) => {
  const { timeReport } = req.body;
  const time = moment().startOf('day');
  const now = moment().format('YYYY-MM-DD HH:mm');
  try {
    let countOrder;
    if (timeReport === 'Mingguan') {
      countOrder = await logHistory.count({
        where: {
          updatedAt: {
            [Op.gt]: time,
            [Op.lt]: now,
          },
        },
        // attributes: ['historyId'],
        // include: [
        //   {
        //     model: product,

        //     attributes: ['productName'],
        //   },
        // ],
        group: ['productId'],
      });
    } else if (timeReport === 'Bulanan') {
      countOrder = await logHistory.count({
        where: {
          updatedAt: {
            [Op.gt]: moment(time).subtract(1, 'week'),
            [Op.lt]: now,
          },
        },
        // attributes: ['historyId'],
        // include: [
        //   {
        //     model: product,

        //     attributes: ['productName'],
        //   },
        // ],
        group: ['productId'],
      });
    } else if (timeReport === 'Tahunan') {
      countOrder = await logHistory.count({
        where: {
          updatedAt: {
            [Op.gt]: moment(time).subtract(1, 'month'),
            [Op.lt]: now,
          },
        },
        // attributes: ['historyId'],
        // include: [
        //   {
        //     model: product,

        //     attributes: ['productName'],
        //   },
        // ],
        group: ['productId'],
      });
    }
    res.send({
      status: 'Succsess',
      message: 'Sales Report',
      data: {
        countOrder,
        // countOrder: countOrder.rows,
        // dataCount: countOrder.count,
      },
    });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

router.post('/declineTransaction', auth, cancelTransaction);
router.post('/salesReportUser', CountTransactionReport);
router.post('/salesItem', SalesItem);
router.post('/salesTotal', ProfitReport);
router.post('/sendTransaction', sendOrder);
router.post('/confirmTransaction', confirmTransaction);
module.exports = router;
