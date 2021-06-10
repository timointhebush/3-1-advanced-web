const express = require('express');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
const {Post, User} = require('../models');

const router = express.Router();

router.use((req, res, next) => {
    res.locals.user = req.user;
    next();
})

router.get('/manage', isLoggedIn, async (req, res, next) => {
  try {
      const posts = await Post.findAll({
        include: {
          model: User,
          attributes: ['id', 'nick'],
        },
        order: [['createdAt', 'DESC']],
      });
      res.render('manage', {
        title: '플레이리스트 관리하기',
        twits: posts,
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
});

router.get('/join', isNotLoggedIn, (req, res) => {
    res.render('join', {title: '회원가입 - NodeBird'});
});

router.get('/login', isNotLoggedIn, (req, res) => {
  res.render('login');
});

router.get('/', async (req, res, next) => {
    try {
        const posts = await Post.findAll({
          include: {
            model: User,
            attributes: ['id', 'nick'],
          },
          order: [['createdAt', 'DESC']],
        });
        res.render('main', {
          title: 'SONGBOX',
          twits: posts,
        });
      } catch (err) {
        console.error(err);
        next(err);
      }
});

module.exports = router;