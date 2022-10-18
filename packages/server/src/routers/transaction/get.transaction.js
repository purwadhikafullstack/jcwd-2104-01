const express = require('express');
const router = express.Router();
const { Op, Sequelize } = require('sequelize');
const moment = require('moment');

const {
  Address,
  transaction,
  detailTransaction,
  product,
} = require('../../../models');
const { auth } = require('../../helpers/auth');

const allTransactionByAdmin = async (req, res, next) => {
  try {
    const {
      createdAt = new Date().getTime(),
      selected,
      page = 1,
      pageSize = 4,
      sorting = 'transactionId',
      order = 'ASC',
    } = req.query;

    var StatusTransaction;
    const limit = Number(pageSize);
    const offset = (Number(page) - 1) * Number(pageSize);

    const getSelectData = async (StatusTransaction) => {
      const restransactionStatus = await transaction.findAndCountAll({
        order: Sequelize.literal(`${sorting} ${order}`),
        where: {
          transactionStatus: StatusTransaction,
        },
        offset,
        limit,
      });

      res.send({
        status: 'success',
        message: 'Fetch Transaction',
        data: {
          // restransactionStatus: sortedData,
          restransactionStatus: restransactionStatus.rows,
          totalPage: restransactionStatus.count,
        },
      });
    };
    const getAllData = async () => {
      const restransactionStatus = await transaction.findAndCountAll({
        order: Sequelize.literal(`${sorting} ${order}`),

        offset,
        limit,
      });

      res.send({
        status: 'success',
        message: 'Fetch Transaction',
        data: {
          restransactionStatus: restransactionStatus.rows,
          totalPage: restransactionStatus.count,
        },
      });
    };
    switch (Number(selected)) {
      case 1:
        // StatusTransaction = 'Menuggu Pembayaran';
        getSelectData('Menunggu Pembayaran');
        break;
      case 2:
        // StatusTransaction = 'Menuggu Konfirmasi Pembayaran';
        getSelectData('Menunggu Konfirmasi Pembayaran');
        break;
      case 3:
        // StatusTransaction = 'Diproses';
        getSelectData('Diproses');
        break;
      case 4:
        // StatusTransaction = 'Dibatalkan';
        getSelectData('Dibatalkan');
        break;
      case 5:
        // StatusTransaction = 'Dikirim';
        getSelectData('Dikirim');
        break;
      case 6:
        // StatusTransaction = 'Pesanan Dikonfirmasi';
        getSelectData('Pesanan Dikonfirmasi');
        break;

      default:
        getAllData();
        break;
    }
  } catch (error) {
    next(error);
    console.log(error);
  }
};

const getTransactionUser = async (req, res, next) => {
  try {
    const { transactionId } = req.params;

    const getTransactData = await detailTransaction.findAll({
      where: {
        transactionId,
      },
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
          paranoid: false,
        },
        {
          model: transaction,
          attributes: [
            'userId',
            'transactionId',
            'addressId',
            'total',
            'paymentProof',
            'transactionStatus',
            'createdAt',
            'kurir',
            'biaya',
            'estimasi',
          ],
        },
      ],
    });

    res.send({
      status: 'Succsess',
      message: 'data transaction',
      data: {
        getTransactData,
      },
    });
  } catch (error) {
    next(error);
    console.log(error);
  }
};
const getTransactionUserByAdmin = async (req, res, next) => {
  try {
    const { transactionId } = req.query;

    const getTransactData = await detailTransaction.findAll({
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
          paranoid: false,
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

    res.send({
      status: 'Succsess',
      message: 'data transaction',
      data: {
        getTransactData,
      },
    });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

const getTransactionSelected = async (req, res, next) => {
  try {
    let {
      createdAt,
      selected,
      page = 1,
      pageSize = 4,
      sorting = 'transactionId',
      order = 'ASC',
    } = req.query;

    if (createdAt == 'undefined') {
      var waktu = moment().format('YYYY-MM-DD HH:mm:ss');
    } else {
      var waktu = createdAt;
    }

    const { userId } = req.user;

    var StatusTransaction;
    var endDate = new Date(moment(waktu).add(1, 'M').format('MM-DD-YYYY'));
    const limit = Number(pageSize);

    const offset = (Number(page) - 1) * Number(pageSize);

    const getSelectData = async (StatusTransaction) => {
      const restransactionStatus = await transaction.findAndCountAll({
        order: Sequelize.literal(`${sorting} ${order}`),
        where: {
          userId,
          transactionStatus: StatusTransaction,
          createdAt: waktu
            ? { [Op.between]: [waktu, endDate] }
            : { [Op.or]: null },
        },
        offset,
        limit,
      });

      res.send({
        status: 'success',
        message: 'Fetch Transaction',
        data: {
          restransactionStatus: restransactionStatus.rows,
          totalPage: restransactionStatus.count,
        },
      });
    };

    const getAlltData = async () => {
      const restransactionStatus = await transaction.findAndCountAll({
        order: Sequelize.literal(`${sorting} ${order}`),
        where: {
          userId,
          createdAt: createdAt
            ? { [Op.between]: [createdAt, endDate] }
            : { [Op.or]: null },
        },
        offset,
        limit,
      });

      res.send({
        status: 'success',
        message: 'Fetch Transaction',
        data: {
          restransactionStatus: restransactionStatus.rows,
          totalPage: restransactionStatus.count,
        },
      });
    };
    switch (Number(selected)) {
      case 1:
        getSelectData('Menunggu Pembayaran');
        break;
      case 2:
        getSelectData('Menunggu Konfirmasi Pembayaran');
        break;
      case 3:
        getSelectData('Diproses');
        break;
      case 4:
        getSelectData('Dibatalkan');
        break;
      case 5:
        getSelectData('Dikirim');
        break;
      case 6:
        getSelectData('Pesanan Dikonfirmasi');
        break;

      default:
        getAlltData();

        break;
    }
  } catch (error) {
    next(error);
    console.log(error);
  }
};

const getTransactionSelected1 = async (req, res, next) => {
  try {
    const {
      selected,
      page = 1,
      pageSize = 4,
      sorting = 'transactionId',
      order = 'ASC',
    } = req.query;

    const { userId } = req.user;

    var StatusTransaction;

    const limit = Number(pageSize);

    const offset = (Number(page) - 1) * Number(pageSize);

    const getSelectData = async (StatusTransaction) => {
      const restransactionStatus = await transaction.findAndCountAll({
        order: Sequelize.literal(`${sorting} ${order}`),
        where: {
          userId,
          transactionStatus: StatusTransaction,
        },
        offset,
        limit,
      });

      res.send({
        status: 'success',
        message: 'Fetch Transaction',
        data: {
          restransactionStatus: restransactionStatus.rows,
          totalPage1: restransactionStatus.count,
        },
      });
    };
    const getAlltData = async () => {
      const restransactionStatus = await transaction.findAndCountAll({
        order: Sequelize.literal(`${sorting} ${order}`),
        where: {
          userId,
        },
        offset,
        limit,
      });

      res.send({
        status: 'success',
        message: 'Fetch Transaction',
        data: {
          restransactionStatus: restransactionStatus.rows,
          totalPage1: restransactionStatus.count,
        },
      });
    };
    switch (Number(selected)) {
      case 1:
        getSelectData('Menunggu Pembayaran');
        break;
      case 2:
        getSelectData('Menunggu Konfirmasi Pembayaran');
        break;
      case 3:
        getSelectData('Diproses');
        break;
      case 4:
        getSelectData('Dibatalkan');
        break;
      case 5:
        getSelectData('Dikirim');
        break;
      case 6:
        getSelectData('Pesanan Dikonfirmasi');
        break;

      default:
        getAlltData();

        break;
    }
  } catch (error) {
    next(error);
    console.log(error);
  }
};

router.get('/historyTransaction', auth, getTransactionSelected);
router.get('/historyTransactionNorm', auth, getTransactionSelected1);
router.get('/allTransByAdmin', allTransactionByAdmin);
router.get('/dataTransaction/:transactionId', auth, getTransactionUser);
router.get('/dataTransactionByAdmin', getTransactionUserByAdmin);
module.exports = router;
