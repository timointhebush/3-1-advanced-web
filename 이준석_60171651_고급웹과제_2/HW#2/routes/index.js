const express = require('express');
const User = require('../models/user');

const router = express.Router();

//첫 메인페이지가 로드되었을 때, 사용자 정보를 담은 변수를 넘겨 주면서
//index.html을 render. 사용자 정보들이 table에 나타남.
router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.render('index', { users });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
