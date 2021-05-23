// sequelize 설정.
const Sequelize = require('sequelize');
const User = require('./user');
const Playlist = require('./playlist');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = User;
db.Playlist = Playlist;

User.init(sequelize);
Playlist.init(sequelize);

User.associate(db);
Playlist.associate(db);

module.exports = db;
