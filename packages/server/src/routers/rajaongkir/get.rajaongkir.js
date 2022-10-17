const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

const { RAJAONGKIR_URL, RAJAONGKIR_KEY, RAJAONGKIR_HEADERS } = process.env;

//config axios to rajaongkir
axios.defaults.baseURL = RAJAONGKIR_URL;
axios.defaults.headers.common['key'] = RAJAONGKIR_KEY;
axios.defaults.headers.post['Content-Type'] = RAJAONGKIR_HEADERS;

//get province endpoint
router.get('/provinsi', (req, res) => {
  axios
    .get('/province')
    .then((response) => res.json(response.data))
    .catch((err) => res.send(err));
});

//get city endpoint
router.get('/kota/:provId', (req, res) => {
  const id = req.params.provId;
  axios
    .get(`/city?province=${id}`)
    .then((response) => res.json(response.data))
    .catch((err) => res.send(err));
});

// get ongkir endpoint
router.get('/ongkos/:origin/:destination/:weight/:courier', (req, res) => {
  const param = req.params;
  axios
    .post('/cost', {
      origin: param.origin,
      destination: param.destination,
      weight: param.weight,
      courier: param.courier,
    })
    .then((response) => res.json(response.data))
    .catch((err) => res.send(err));
});

module.exports = router;
