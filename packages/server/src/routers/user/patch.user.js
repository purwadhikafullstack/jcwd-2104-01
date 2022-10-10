const { resolveStyleConfig } = require('@chakra-ui/react');
const e = require('cors');
const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { user } = require('../../../models');
const { auth } = require('../../helpers/auth');
const { hash, compare } = require('../../lib/bycrypt');
const { isFieldEmpties, passwordValidator } = require('../../helpers');

const changePassController = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, ConfirmPassword, userId } = req.body;

    const equalizePass = await user.findOne({ where: { userId } });
    const userData = equalizePass.dataValues;
    const compareold = compare(oldPassword, userData.password);
    if (!compareold) {
      res.send({ code: 400, message: 'Password incorrect' });
    }

    if (newPassword !== ConfirmPassword) {
      res.send({
        code: 400,
        message: 'Password doesnt match',
        detail: `Password: ${newPassword}, Confirm Password: ${ConfirmPassword}`,
      });
    }
    const validatePassword = passwordValidator(newPassword);
    if (validatePassword)
      throw {
        code: 400,
        message: validatePassword,
      };

    const resChangePass = await user.findOne({ where: { userId } });

    const passwordHash = hash(newPassword);
    await resChangePass.update({ password: passwordHash });
    const resUpdated = await resChangePass.save();

    res.send({
      status: 'Success',
      message: 'Success updated password',
      detail: { resUpdated },
    });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { newPassword, ConfirmPassword } = req.body;
    const { userId } = req.params;

    const validatePassword = passwordValidator(newPassword);
    if (validatePassword)
      throw {
        code: 400,
        message: validatePassword,
      };

    if (newPassword !== ConfirmPassword) {
      res.send({
        code: 400,
        message: 'Password doesnt match',
        detail: `Password: ${newPassword}, Confirm Password: ${ConfirmPassword}`,
      });
    }
    const resForgotPass = await user.findOne({ where: { userId } });
    const passwordHash = hash(newPassword);
    await resForgotPass.update({ password: passwordHash });
    const resUpdated = await resForgotPass.save();

    res.send({
      status: 'Success',
      message: 'Success updated password',
      detail: { resUpdated },
    });
  } catch (error) {
    next(error);
  }
};

const updateUserController = async (req, res, next) => {
  const { email, first_name, last_name, birthDate, phone, gender, image } =
    req.body;

  try {
    const getUser = await user.findAll({
      where: {
        userId: { [Op.ne]: req.user.userId },
        [Op.or]: [{ email: req.body.email }, { phone: req.body.phone }],
      },
    });
    if (getUser.length) {
      getUser.map((c) => {
        if (c.dataValues.email == req.body.email) {
          throw { message: 'Email is already exists' };
        }
        if (c.dataValues.phone == req.body.phone) {
          throw { message: 'Phone number is already exists' };
        }
      });
    }
    const updateUser = await user.update(
      { email, first_name, last_name, birthDate, phone, gender, image },
      {
        where: { userId: req.user.userId },
      },
    );

    if (!updateUser[0]) throw { message: 'Failed to update user data' };
    res.send({ message: 'Success Update User' });
  } catch (error) {
    res.status(400).send(error);
  }
};

router.patch('/updatePassword/', changePassController);
router.patch('/forgotPassword/:userId', forgotPassword);
router.patch('/', auth, updateUserController);

module.exports = router;
