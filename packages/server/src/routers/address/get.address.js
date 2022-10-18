const express = require('express');
const router = express.Router();
const { Address } = require('../../../models');
const { auth } = require('../../helpers/auth');

const getUserAddresses = async (req, res, next) => {
  try {
    const { userId } = req.user;

    const resGetUserAddress = await Address.findAll({
      where: { userId },
      order: [['isMain', 'DESC']],
    });
    if (!resGetUserAddress) throw { message: 'Alamat tidak ditemukan' };

    res.send({
      status: 'Success',
      message: 'Success get user addresses',
      data: resGetUserAddress,
    });
  } catch (error) {
    next(error);
  }
};

const getUserMainAddress = async (req, res, next) => {
  try {
    const { userId } = req.user;

    const resGetUserMainAddress = await Address.findOne({
      where: { userId, isMain: true },
    });
    // if (!resGetUserMainAddress)
    //   throw { message: 'Alamat utama tidak ditemukan' };

    res.send({
      status: 'Success',
      message: 'Success get user addresses',
      data: resGetUserMainAddress,
    });
  } catch (error) {
    next(error);
  }
};

const getUserAddressTransaction = async (req, res, next) => {
  try {
    const { addressId } = req.query;

    const { userId } = req.user;
    const resGetUserAddressTransaction = await Address.findAll({
      where: { userId, addressId },
    });

    res.send({
      status: 'Success',
      message: 'Success get user addresses',
      data: resGetUserAddressTransaction,
    });
  } catch (error) {
    next(error);
  }
};

router.get('/userAddress', auth, getUserAddresses);
router.get('/mainAddress', auth, getUserMainAddress);
router.get('/addressTransaction', auth, getUserAddressTransaction);

module.exports = router;
