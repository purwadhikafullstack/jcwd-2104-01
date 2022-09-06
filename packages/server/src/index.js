require('dotenv/config');
const express = require('express');
const cors = require('cors');
const userRouter = require('./routers/user');
const { join } = require('path');

const PORT = process.env.PORT || 8000;
const app = express();
app.use(cors());
app.use('/api/public', express.static('public'));
app.use(express.json());

app.get('/api', (req, res) => {
  res.send(`Hello, this is my API`);
});

app.use('/api/users', userRouter);

app.listen(PORT, (err) => {
  if (err) {
    console.log(`ERROR: ${err}`);
  } else {
    console.log(`APP RUNNING at ${PORT} ✅`);
  }
});
