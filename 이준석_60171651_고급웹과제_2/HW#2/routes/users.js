const express = require('express');
const User = require('../models/user');
const Playlist = require('../models/playlist');

const router = express.Router();

// 프론트에서 유저 정보가 필요할때, 정보가 담긴 users변수를 넘겨줌.
router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.json(users);
  }catch(err) {
    console.error(err);
    next(err);
  }
});

// 사용자 정보를 등록할 때.
router.post('/', async (req, res, next) => {
  try {
    const user = await User.create({
      email: req.body.email,
      name: req.body.name,
      notice: req.body.notice,
    });
    console.log(user);
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 프론트에서 특정 사용자의 플레이리스트 정보를 가져올 때.
router.get('/:id/playlist', async (req, res, next) => {
  try {
    const playlists = await Playlist.findAll({
      include: {
        model: User,
        where: { id: req.params.id },
      },
    });
    console.log(playlists);
    res.json(playlists);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 특정 사용자를 삭제할 떄.
router.delete('/:id', async (req, res, next) => {
  try {
      const result = await User.destroy({ where: { id: req.params.id } });
      res.json(result);
    } catch (err) {
      console.error(err);
      next(err);
    }
});

module.exports = router;