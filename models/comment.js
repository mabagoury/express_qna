'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Comment.belongsTo(models['User'], {
        as: 'author',
        foreignKey: 'authorId'
      });

      Comment.belongsToMany(models['User'], {
        as: 'upvoters',
        through: 'CommentUpvoters'
      });

      Comment.belongsToMany(models['User'], {
        as: 'downvoters',
        through: 'CommentDownvoters'
      });

      Comment.belongsTo(models['Question'], {
          foreignKey: {
            // TODO: correct this foreign key in the database
            name: 'QuestionId',
            allowNull: false
         }
      });

      Comment.belongsTo(models['Answer'],{
        foreignKey: {
          name: 'answerId',
          allowNull: false
        }
      });
    }
  }
  Comment.init({
    content: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};