const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../lib/token');
const { user } = require('../../../models');

const verifyUserController = async (req, res, next) => {
  try {
    const { token } = req.params;

    const getUserToken = await user.findOne({
      where: { token },
    });

    if (!getUserToken)
      return res.send(
        `<html>
    <head>
      <link href="https://fonts.googleapis.com/css?family=Nunito+Sans:400,400i,700,900&display=swap" rel="stylesheet">
    </head>
      <style>
        body {
          text-align: center;
          padding: 40px 0;
          background: #EBF0F5;
        }
          h1 {
            color: #F22E2E;
            font-family: "Nunito Sans", "Helvetica Neue", sans-serif;
            font-weight: 900;
            font-size: 40px;
            margin-bottom: 10px;
          }
          p {
            color: #404F5E;
            font-family: "Nunito Sans", "Helvetica Neue", sans-serif;
            font-size:20px;
            margin: 0;
          }
        i {
          color: #F22E2E;
          font-size: 100px;
          line-height: 200px;
          margin-left:-15px;
        }
        .card {
          background: white;
          padding: 60px;
          border-radius: 4px;
          box-shadow: 0 2px 3px #C8D0D8;
          display: inline-block;
          margin: 0 auto;
        }
      </style>
      <body>
        <div class="card">
        <div style="border-radius:200px; height:200px; width:200px; background: #F8FAF5; margin:0 auto;">
          <i class="checkmark">X</i>
        </div>
          <h1>GAGAL !</h1> 
          <p> Gagal Verifikasi Akun. <br/>Gunakan link verifikasi terbaru, <br/>atau kirim ulang email verifikasi</p>
        </div>
      </body>
  </html>`,
      );

    const verifiedToken = verifyToken(token);

    const [resUpdateIsVerifiedStatus] = await user.update(
      { isVerified: true },
      {
        where: {
          userId: verifiedToken.userId,
        },
      },
    );

    if (!resUpdateIsVerifiedStatus)
      throw { message: 'Failed verification user' };

    res.send(`<html>
    <head>
      <link href="https://fonts.googleapis.com/css?family=Nunito+Sans:400,400i,700,900&display=swap" rel="stylesheet">
    </head>
      <style>
        body {
          text-align: center;
          padding: 40px 0;
          background: #EBF0F5;
        }
          h1 {
            color: #88B04B;
            font-family: "Nunito Sans", "Helvetica Neue", sans-serif;
            font-weight: 900;
            font-size: 40px;
            margin-bottom: 10px;
          }
          p {
            color: #404F5E;
            font-family: "Nunito Sans", "Helvetica Neue", sans-serif;
            font-size:20px;
            margin: 0;
          }
        i {
          color: #9ABC66;
          font-size: 100px;
          line-height: 200px;
          margin-left:-15px;
        }
        .card {
          background: white;
          padding: 60px;
          border-radius: 4px;
          box-shadow: 0 2px 3px #C8D0D8;
          display: inline-block;
          margin: 0 auto;
        }
      </style>
      <body>
        <div class="card">
        <div style="border-radius:200px; height:200px; width:200px; background: #F8FAF5; margin:0 auto;">
          <i class="checkmark">✓</i>
        </div>
          <h1>BERHASIL !</h1> 
          <p>Akun anda telah terverifikasi<br/> Klik <a href="https://jcwd210401.purwadhikabootcamp.com/">di sini</a> untuk menuju ke beranda</p>
        </div>
      </body>
  </html>`);
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const resGetUser = await user.findOne({
      where: { userId },
    });
    const { dataValues } = resGetUser;
    res.send({ data: dataValues });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

const getUserWithToken = async (req, res, next) => {
  try {
    const token = req.token;
    const verifiedToken = verifyToken(token);

    const { userId } = verifiedToken;

    const resGotUser = await user.findOne({ where: { userId } });
    const { dataValues } = resGotUser;
    res.send({
      status: 'Success',
      message: 'Get user with token',
      user: dataValues,
    });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

router.get('/forgot/password', getUserWithToken);
router.get('/:userId', getUser);
router.get('/verification/:token', verifyUserController);

module.exports = router;
