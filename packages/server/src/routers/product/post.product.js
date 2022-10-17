const express = require('express');
const slugify = require('slugify');
const router = express.Router();
const { auth } = require('../../helpers/auth');
const {
  product,
  detailProduct,
  logHistory,
  sequelize,
  productCategory,
} = require('../../../models');
const { uploadProduct } = require('../../lib/multer');

const postObatRacikan = async (req, res, next) => {
  const { formula, productName, stock = 1, kategori } = req.body;
  let stocks = Number(stock);
  const { userId } = req.user;
  const t = await sequelize.transaction();

  try {
    // Checking product name
    const getExistingProduct = await product.findAll({
      where: { productName },
      transaction: t,
    });

    if (getExistingProduct.length)
      throw { code: 400, message: 'Nama product sudah digunakan' };

    let harga = 0;
    const getInitialStock = await Promise.all(
      formula.map(async (data) => {
        let quantities = Number(data.quantity);
        const existingProducts = await product.findOne({
          where: {
            productName: data.productName,
          },
          include: [{ model: detailProduct }],
          transaction: t,
        });

        if (!existingProducts)
          throw {
            code: 404,
            message: `Product ${data.productName} tidak ditemukan`,
          };
        harga +=
          (existingProducts.dataValues.price /
            existingProducts.dataValues.detailProduct.dataValues.quantity) *
          quantities;

        for (i = 0; i < stocks; i++) {
          const existingProduct = await product.findOne({
            where: {
              productName: data.productName,
            },
            include: [{ model: detailProduct }],
            transaction: t,
          });

          if (
            existingProduct.dataValues.detailProduct.dataValues
              .currentQuantity < quantities
          ) {
            if (existingProduct.dataValues.stock == 0)
              throw {
                code: 404,
                message: `Stock ${data.productName} Habis`,
              };
            await product.update(
              {
                stock: existingProduct.dataValues.stock - 1,
              },
              { where: { productName: data.productName }, transaction: t },
            );
            await detailProduct.update(
              {
                currentQuantity:
                  existingProduct.dataValues.detailProduct.dataValues
                    .currentQuantity +
                  existingProduct.dataValues.detailProduct.dataValues.quantity,
              },
              {
                where: { productId: existingProduct.dataValues.productId },
                transaction: t,
              },
            );
            const newDetailProduct = await detailProduct.findOne({
              where: { productId: existingProduct.dataValues.productId },
              transaction: t,
            });
            await detailProduct.update(
              {
                currentQuantity:
                  newDetailProduct.dataValues.currentQuantity - quantities,
              },
              {
                where: { productId: newDetailProduct.dataValues.productId },
                transaction: t,
              },
            );
          } else {
            await detailProduct.update(
              {
                currentQuantity:
                  existingProduct.dataValues.detailProduct.dataValues
                    .currentQuantity - quantities,
              },
              {
                where: { productId: existingProduct.dataValues.productId },
                transaction: t,
              },
            );
          }
        }
        return existingProducts.dataValues.stock;
      }),
    );

    // digunakan buat masukin ke product history
    const getNewStock = await Promise.all(
      formula.map(async (data) => {
        const newProductStock = await product.findOne({
          where: { productName: data.productName },
          transaction: t,
        });
        return newProductStock.dataValues.stock;
      }),
    );

    // digunakan buat masukin ke product history
    const checkPengeluaranStock = getInitialStock.map(
      (data, index) => data - getNewStock[index],
    );

    await Promise.all(
      formula.map(async (data, index) => {
        const newProductStock = await product.findOne({
          where: { productName: data.productName },
          transaction: t,
        });

        const { productId, price } = newProductStock.dataValues;

        if (checkPengeluaranStock[index]) {
          await logHistory.create(
            {
              userId,
              productId,
              quantity: checkPengeluaranStock[index],
              totalPrice: price * checkPengeluaranStock[index],
              status: 'out',
              type: 'Unit conversion',
            },
            { transaction: t },
          );
        }
      }),
    );

    const createNewProduct = await product.create(
      {
        productName,
        stock: stocks,
        formula,
        desc: 'Obat Racikan',
        price: harga,
        url: slugify(productName, { lower: true }),
        unit: 'Racikan',
        satuanUnit: 'Racikan',
        isRacikan: true,
      },
      { transaction: t },
    );
    if (!createNewProduct.dataValues)
      throw { code: 400, message: 'Gagal membuat obat racikan' };

    await logHistory.create(
      {
        userId,
        productId: createNewProduct.dataValues.productId,
        quantity: createNewProduct.dataValues.stock,
        totalPrice: harga * stocks,
        status: 'in',
        type: 'Unit conversion',
      },
      { transaction: t },
    );

    const createProductCategories = await Promise.all(
      kategori.map(async (data) => {
        const createProductCategory = await productCategory.create(
          {
            productId: createNewProduct.dataValues.productId,
            categoryId: data.categoryId,
          },
          { transaction: t },
        );
        return createProductCategory;
      }),
    );

    if (!createProductCategories.length)
      throw { code: 400, message: 'Gagal memasukkan product category' };

    await t.commit();
    res.send({ status: 'Success', message: 'Berhasil membuat obat racikan' });
  } catch (error) {
    next(error);
    await t.rollback();
  }
};

// create new product
const addNewProduct = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const {
      productName,
      desc,
      imageName,
      stock,
      price,
      unit,
      satuanUnit,
      categoryId,
      detailQuantity,
      // userId,
    } = req.body;

    const resGetProduct = await product.findAll({
      where: { productName },
    });

    if (resGetProduct.length) {
      throw { code: 400, message: 'Produk serupa sudah ada dalam stock' };
    }

    const result = await sequelize.transaction(async (t) => {
      const resCreateProduct = await product.create(
        {
          productName,
          desc,
          productImage: imageName,
          stock,
          price,
          unit,
          satuanUnit,
          url: slugify(productName, { lower: true }),
        },
        { transaction: t },
      );

      await detailProduct.create(
        {
          productId: resCreateProduct.dataValues.productId,
          quantity: detailQuantity,
          currentQuantity: 0,
        },
        { transaction: t },
      );

      await productCategory.create(
        { productId: resCreateProduct.dataValues.productId, categoryId },
        { transaction: t },
      );

      await logHistory.create(
        {
          userId,
          productId: resCreateProduct.dataValues.productId,
          quantity: stock,
          totalPrice: stock * price,
          status: 'in',
          type: 'New product',
        },
        { transaction: t },
      );

      return resCreateProduct;
    });
    if (!result) {
      throw { code: 400, message: 'Gagal menambahkan produk' };
    }

    res.send({
      status: 'Success',
      message: 'Berhasil menambahkan produk',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const uploadImage = async (req, res, next) => {
  try {
    return res.send({
      status: 'Success',
      message: 'Success upload product image',
    });
  } catch (error) {
    console.log(error);
  }
};

router.post('/racikan', auth, postObatRacikan);
router.post('/', auth, addNewProduct);
router.post('/upload', auth, uploadProduct.single('gambar'), uploadImage);

module.exports = router;
