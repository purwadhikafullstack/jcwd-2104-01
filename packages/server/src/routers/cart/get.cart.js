const express = require('express');
const router = express.Router();

const { cart, product } = require('../../../models');
const { auth } = require('../../helpers/auth');

const getCartUser = async (req, res, next) => {
  try {
    const { userId } = req.user;

    const getCart = await cart.findAll({
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
          paranoid: false,
        },
      ],
    });
    res.send({
      status: 'Succsess',
      message: 'Succsess add product to cart',
      data: {
        getCart,
      },
    });
  } catch (error) {
    next(error);
    console.log(error);
  }
};
router.get('/getCart/', auth, getCartUser);
module.exports = router;
