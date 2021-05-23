const express = require('express');
const Playlist = require('../models/playlist');

const router = express.Router();

// 플레이리스트에 노래를 등록할 때.
router.post('/', async (req, res, next) => {
    try {
      const playlist = await Playlist.create({
        userid: req.body.id,
        artist: req.body.artist,
        title: req.body.title,
      });
      console.log(playlist);
      res.status(201).json(playlist);
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

// 플레이리스트의 노래 정보를 수정할 때
router.patch('/:id', async (req, res, next) => {
    try {
        const result = await Playlist.update({
          artist: req.body.artist,
          title: req.body.title,
        }, {
          where: { id: req.params.id },
        });
        res.json(result);
      } catch (err) {
        console.error(err);
        next(err);
      }
});

// 플레이리스트의 노래를 삭제할 때.
router.delete('/:id', async (req, res, next) => {
    try {
        const result = await Playlist.destroy({ where: { id: req.params.id } });
        res.json(result);
      } catch (err) {
        console.error(err);
        next(err);
      }
});
module.exports = router;