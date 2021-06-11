const express = require('express');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
const {Playlist, User} = require('../models');

const router = express.Router();

router.use((req, res, next) => {
    res.locals.user = req.user;
    next();
})

// 플레이리스트 관리 페이지
router.get('/manage', isLoggedIn, async (req, res, next) => {
  try {
      console.log(req.user.id);
      const playlist = await Playlist.findAll({
        where: {
          UserId: req.user.id,
        },
        include: {
          model: User,
          attributes: ['id', 'nick'],
        },
        order: [['createdAt', 'DESC']],
      });
      res.render('manage', {
        title: '플레이리스트 관리하기',
        playlist: playlist,
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
});

// 플레이리스트의 노래를 수정
router.patch('/manage', async (req, res, next) => {
  try {
      const result = await Playlist.update({
        artist: req.body.artist,
        title: req.body.title,
        content: req.body.content,
      }, {
        where: { id: req.body.song_id },
      });
      res.json(result);
    } catch (err) {
      console.error(err);
      next(err);
    }
});

// 플레이리스트의 노래를 삭제할 때.
router.delete('/manage/:song_id', async (req, res, next) => {
  try {
      const result = await Playlist.destroy({ where: { id: req.params.song_id } });
      res.json(result);
    } catch (err) {
      console.error(err);
      next(err);
    }
});

// 회원가입 페이지.
router.get('/join', isNotLoggedIn, (req, res) => {
    res.render('join', {title: '회원가입'});
});

// 로그인 페이지.
router.get('/login', isNotLoggedIn, (req, res) => {
  res.render('login');
});

// 메인 화면. 모든 사용자들의 플레이리스트 출력.
router.get('/', async (req, res, next) => {
  try {
    const playlist = await Playlist.findAll({
      include: {
        model: User,
        attributes: ['id', 'nick'],
      },
      order: [['createdAt', 'DESC']],
    });
    res.render('main', {
      title: 'SONGBOX',
      playlist: playlist,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;