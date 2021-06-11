const Sequelize = require('sequelize');

// 사용자들이 등록한 노래 정보를 담고 있는 테이블.
// 아티스트 이름, 노래 제목, 노래에 대한 코멘트, 앨범 커버 이미지 등을 저장.
module.exports = class Post extends Sequelize.Model {
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
      content: {
        type: Sequelize.STRING(140),
        allowNull: false,
      },
      img: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Playlist',
      tableName: 'playlists',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }

  // 하나의 사용자가 여러개의 플레이리스트를 가지고 있는 형태.
  static associate(db) {
    db.Playlist.belongsTo(db.User);
  }
};
