const express = require('express');
const router = express.Router();
const schedule = require('node-schedule');
const moment = require('moment');

const {
  transaction,
  cart,
  product,
  address,
  detailTransaction,
  sequelize,
  prescription,
  logHistory,
} = require('../../../models');
const { auth } = require('../../helpers/auth');

const createTransaction = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { addressId, kurir, biaya, estimasi } = req.body;
    let total;

    const findCart = await cart.findAll({
      where: {
        userId,
      },
      attributes: ['cartId', 'productId', 'quantity'],
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
    });
    const totalPrice = () => {
      const tempPrice = findCart.map((data) => {
        return (
          data.dataValues.product.dataValues.price * data.dataValues.quantity
        );
      });
      const grandTotal = tempPrice.reduce((x, y) => x + y, 0);
      return grandTotal;
    };

    const newTransaction = await transaction.create({
      userId,
      total: totalPrice(),
      addressId,
      kurir,
      biaya,
      estimasi,
      transactionStatus: 'Menunggu Pembayaran',
    });
    const dueDate = moment(newTransaction.dataValues.createdAt).add(1, 'days');

    const wrap = await Promise.all(
      findCart.map(async (data) => {
        try {
          const findExistingProduct = await product.findOne({
            where: {
              productId: data.dataValues.productId,
            },
          });
          return findExistingProduct.dataValues;
        } catch (error) {
          console.log(error);
        }
      }),
    );

    schedule.scheduleJob(new Date(dueDate), async () => {
      const checkStatus = await transaction.findOne({
        where: {
          transactionId: newTransaction.dataValues.transactionId,
          transactionStatus: 'Menunggu Pembayaran',
        },
      });

      findCart.forEach(async (data) => {
        if (checkStatus.dataValues.transactionId) {
          await transaction.update(
            { transactionStatus: 'Dibatalkan' },
            {
              where: {
                transactionId: newTransaction.dataValues.transactionId,
              },
            },
          );
          const updateProduct = await product.findOne({
            where: { productId: data.dataValues.productId },
          });

          await product.update(
            {
              stock: updateProduct.dataValues.stock + data.dataValues.quantity,
            },
            { where: { productId: data.dataValues.productId } },
          );
          await cart.destroy({
            where: { userId },
          });
        }
      });
    });
    findCart.map(async (data) => {
      await detailTransaction.create({
        quantity: data.dataValues.quantity,
        productId: data.dataValues.productId,
        transactionId: newTransaction.dataValues.transactionId,
      });
    });
    findCart.map(async (data) => {
      const updateProduct = await product.findOne({
        where: { productId: data.dataValues.productId },
      });

      await product.update(
        {
          stock: updateProduct.dataValues.stock - data.dataValues.quantity,
        },
        {
          where: { productId: data.dataValues.productId },
        },
      );
      await cart.destroy({
        where: { userId },
      });
    });

    res.send({
      status: 'Succsess',
      message: 'Succsess add cart to transaction',
      data: {
        wrap,
        ID: newTransaction.dataValues.transactionId,
      },
    });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

const ConfrimDeliveryTransaction = async (req, res, next) => {
  try {
    const { transactionId } = req.query;
    const findTransaction = await transaction.findAll({
      where: { transactionId },
    });

    const finishTransaction = await transaction.update(
      { transactionStatus: 'Pesanan Dikonfirmasi' },
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

const CancelTransaction = async (req, res, next) => {
  try {
    const { transactionId } = req.query;
    const { userId } = req.user;
    const findTransaction = await transaction.findAll({
      where: { transactionId },
    });

    let statusTR;
    findTransaction.map(async (data) => {
      statusTR = data.dataValues.transactionStatus;
      if (
        statusTR == 'Menunggu Pembayaran' ||
        statusTR == 'Menunggu Konfirmasi Pembayaran'
      ) {
        await transaction.update(
          { transactionStatus: 'Dibatalkan' },
          {
            where: {
              transactionId: data.dataValues.transactionId,
            },
          },
        );
        const getDTData = await detailTransaction.findAll({
          where: { transactionId: data.dataValues.transactionId },
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
        getDTData.map(async (data) => {
          const updateProduct = await product.findOne({
            where: { productId: data.dataValues.productId },
          });
          await product.update(
            {
              stock: updateProduct.dataValues.stock + data.dataValues.quantity,
            },
            {
              where: { productId: updateProduct.dataValues.productId },
            },
          );
        });

        res.send({
          status: 'Succsess',
          message: 'Cancel Transaction',
        });
      }
    });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

const CreateNewPrescriptionTransaction = async (req, res, next) => {
  const { userId } = req.user;
  const { addressId, kurir, biaya, estimasi } = req.body;

  const resCreatePrescriptionTransaction = await transaction.create({
    userId,
    addressId,
    transactionStatus: 'Menunggu Konfirmasi Resep',
    kurir,
    biaya,
    estimasi,
  });

  res.send({
    status: 'Berhasil',
    message: 'Berhasil membuat transaksi resep',
  });
};

const inputProductFromPrescriptionController = async (req, res, next) => {
  const { products, userId, prescriptionId } = req.body;
  const t = await sequelize.transaction();

  try {
    const getTransaction = await transaction.findOne({
      where: { userId, transactionStatus: 'Menunggu Konfirmasi Resep' },
      transaction: t,
    });
    const { transactionId } = getTransaction.dataValues;

    let harga = 0;
    const wrap = await Promise.all(
      products.map(async (data) => {
        const kuantiti = Number(data.quantity);
        const getProductId = await product.findOne({
          where: { productName: data.productName },
          attributes: ['productId', 'price', 'stock'],
          transaction: t,
        });
        const { productId, price, stock } = getProductId.dataValues;

        if (stock < kuantiti)
          throw {
            code: 400,
            message: `Kuantiti maksimal product ${data.productName} adalah ${stock}`,
          };

        const mengurangiStockProduct = await product.update(
          {
            stock: stock - kuantiti,
          },
          { where: { productId }, transaction: t },
        );

        if (!mengurangiStockProduct[0])
          throw {
            code: 400,
            message: 'Gagal mengurangi stock product',
          };

        const inputToDetailTransaction = await detailTransaction.create(
          {
            productId,
            transactionId,
            quantity: kuantiti,
          },
          { transaction: t },
        );
        if (!inputToDetailTransaction.dataValues)
          throw {
            code: 400,
            message: 'Gagal input barang',
          };
        harga += price * kuantiti;
      }),
    );

    await prescription.update(
      { status: 'processed' },
      { where: { prescriptionId }, transaction: t },
    );

    await transaction.update(
      {
        transactionStatus: 'Menunggu Pembayaran',
        total: harga,
      },
      { where: { transactionId }, transaction: t },
    );
    await t.commit();
    res.send({ message: 'Berhasil input product' });
  } catch (error) {
    await t.rollback();
    next(error);
  }
};
router.post('/cancelTransaction/:transactionId', auth, CancelTransaction);
router.post('/confirmTransaction/:transactionId', ConfrimDeliveryTransaction);
router.post('/newTransaction', auth, createTransaction);
router.post('/newPrescription', auth, CreateNewPrescriptionTransaction);
router.post(
  '/inputProductFromPrescription',
  auth,
  inputProductFromPrescriptionController,
);

module.exports = router;
