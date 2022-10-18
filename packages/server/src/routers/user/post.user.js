const express = require('express');
const router = express.Router();

const { user } = require('../../../models');

const { isFieldEmpties, passwordValidator } = require('../../helpers');
const validator = require('email-validator');
const { compare, hash } = require('../../lib/bcrypt');
const { createToken } = require('../../lib/token');

const { sendMail, sendForgotPasswordMail } = require('../../lib/nodemailer');

const { auth } = require('../../helpers/auth');
const { uploadUser } = require('../../lib/multer');
const fs = require('fs');
const path = require('path');
const appRoot = require('app-root-path');

const registerUserHandler = async (req, res, next) => {
  try {
    const { first_name, last_name, email, phone, password, confirmPassword } =
      req.body;
    const emptyFields = isFieldEmpties({
      first_name,
      last_name,
      email,
      phone,
      password,
      // confirmPassword,
    });
    // if (emptyFields.length) {
    //   throw {
    //     code: 400,
    //     message: `Empty fields: ${emptyFields}`,
    //     data: { result: emptyFields },
    //   };
    // }
    // checking email
    // const emailValidator = validator.validate(email);
    // if (!emailValidator) {
    //   throw {
    //     code: 400,
    //     message: 'Wrong email format',
    //   };
    // }

    //checking password
    // const validatePassword = passwordValidator(password);
    // if (validatePassword)
    //   throw {
    //     code: 400,
    //     message: validatePassword,
    //   };

    // match password
    // if (password !== confirmPassword)
    //   throw { code: 400, message: "Password didn't match" };

    // check exist email
    const resGetUser = await user.findOne({
      where: { email },
    });
    if (resGetUser) {
      const user = resGetUser.dataValues;
      if (user.email == email) {
        throw {
          code: 400,
          message: 'Email is already use',
        };
      }
    }

    // hash password
    const encryptedPassword = hash(password);

    //post user
    const resCreateUser = await user.create({
      first_name,
      last_name,
      email,
      phone,
      password: encryptedPassword,
    });

    const userId = resCreateUser.dataValues.userId;

    //cretae token
    const token = createToken({ userId });
    const saveToken = await user.update({ token }, { where: { userId } });

    //send email
    await sendMail({ email, token });

    res.send({
      status: 'Berhasil',
      message: 'Periksa email anda untuk verifikasi akun',
      data: {
        result: resCreateUser,
      },
    });
  } catch (error) {
    next(error);
  }
};
// resend email verification endpoint
const resendEmailVerification = async (req, res, next) => {
  try {
    const { email, userId } = req.body;

    // create new token
    const token = createToken({ userId });

    // update new token to db
    const updateToken = await user.update({ token }, { where: { userId } });

    // sending new email verification
    await sendMail({ email, token });

    res.send({
      status: 'Berhasil',
      message: 'Berhasil mengirim ulang email verifikasi',
      data: {
        result: updateToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

const loginUserController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const resGetLoginUser = await user.findOne({
      where: { email: email },
    });

    if (!resGetLoginUser) {
      throw {
        code: 400,
        message: 'email yang anda masukan salah',
      };
    }
    const userPass = resGetLoginUser.dataValues;

    const validatePassword = passwordValidator(password);
    if (validatePassword)
      throw {
        code: 400,
        message: validatePassword,
      };

    //sementara
    // if (password !== userPass.password) {
    //   throw {
    //     code: 400,
    //     message: 'password yang anda masukan salah',
    //   };
    // }

    //kalau udh pake hashing
    const isPasswordMatch = compare(password, userPass.password);

    if (!isPasswordMatch) {
      throw {
        code: 400,
        message: `Password yang anda masukan salah`,
      };
    }

    const token = createToken({
      userId: userPass.userId,
      first_name: userPass.first_name,
    });

    res.send({
      status: 'Succsess',
      message: 'Login Succsess',
      data: {
        result: {
          userId: userPass.userId,
          first_name: userPass.first_name,
          accessToken: token,
        },
      },
    });

    //admin Login
    if (resGetLoginUser.dataValues.isAdmin) {
      const { email, password } = req.body;

      const resGetLoginUser = await user.findOne({
        where: { email: email },
      });

      if (!resGetLoginUser) {
        throw {
          code: 400,
          message: 'email yang anda masukan salah',
        };
      }
      const userPass = resGetLoginUser.dataValues;
      const isPasswordMatch = compare(password, userPass.password);

      if (!isPasswordMatch) {
        throw {
          code: 400,
          message: `Password yang anda masukan salah`,
        };
      }
      const validatePassword = passwordValidator(password);
      if (validatePassword)
        throw {
          code: 400,
          message: validatePassword,
        };

      const token = createToken({
        userId: userPass.userId,
        first_name: userPass.first_name,
      });
      res.send({
        status: 'Succsess',
        message: 'Login Succsess admin',
        data: {
          result: {
            userId: userPass.userId,
            first_name: userPass.first_name,
            accessToken: token,
          },
        },
      });
    }
  } catch (error) {
    next(error);
    console.log(error);
  }
};

const forgotPasswordController = async (req, res, next) => {
  try {
    const { email } = req.body;
    const fiundUser = await user.findOne({ where: { email: email } });

    if (!fiundUser) return res.status(400).send('Email Tidak Terdaftar');

    const token = createToken({
      userId: fiundUser.dataValues.userId,
      first_name: fiundUser.dataValues.first_name,
    });

    sendForgotPasswordMail({
      email,
      token,
      first_name: fiundUser.dataValues.first_name,
    });

    res.send({
      status: 'succsess',
      message: 'succsess send Forgot Password Request',
    });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

const uploadUserImageController = async (req, res) => {
  try {
    const { userId } = req.user;
    const postPath = path.join(appRoot.path, 'packages', 'server');

    const resGetUser = await user.findOne({ where: { userId } });

    const { dataValues } = resGetUser;

    const paths = postPath + dataValues.image;

    if (dataValues.image.split('/')[3] != 'default-avatar.png') {
      fs.unlink(paths, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    }

    return res.send({
      status: 'Success',
      message: 'Success upload user image',
    });
  } catch (error) {
    next(error);
  }
};

router.post(
  '/upload',
  auth,
  uploadUser.single('gambar'),
  uploadUserImageController,
);
router.post('/register', registerUserHandler);
router.post('/verification', resendEmailVerification);
router.post('/login', loginUserController);
router.post('/forgotPassword', forgotPasswordController);

module.exports = router;
