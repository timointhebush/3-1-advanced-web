// playlist데이터 저장을 위한 table 생성.

const Sequelize = require('sequelize');

module.exports = class Playlist extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      artist: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
      },
    }, {
      sequelize,
      timestamps: false,
      modelName: 'Playlist',
      tableName: 'playlists',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }

  static associate(db) {
    db.Playlist.belongsTo(db.User, { foreignKey: 'userid', targetKey: 'id' });
  }
};

