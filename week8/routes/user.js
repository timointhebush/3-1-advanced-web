const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello, Everybody');
});

router.get('/nodejs', (req, res) => {
  res.send('Hello, NodeJs Class Users!');
});

router.get('/javascript', (req, res) => {
  res.send('Hello, JavaScript Class Users!');
});

router.get('/:name', (req, res) => {
  res.send(`Hello, User ${req.params.name}`);
});

module.exports = router;
