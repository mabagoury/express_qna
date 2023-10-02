'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Answer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Answer.belongsTo(models['User'], {
        as: 'author',
        foreignKey: 'authorId'
      });

      Answer.belongsToMany(models['User'], {
        as: 'upvoters',
        through: 'AnswerUpvoters',
        foreignKey: 'answerId',
        otherKey: 'upvoterId'
      });

      Answer.belongsToMany(models['User'], {
        as: 'downvoters',
        through: 'AnswerDownvoters',
        foreignKey: 'answerId',
        otherKey: 'downvoterId'
      });

      Answer.belongsTo(models['Question'],{
          foreignKey: {
            name: 'questionId',
            allowNull: false
          }
        });

      Answer.hasMany(models['Comment'], {
        foreignKey: {
          name: 'answerId',
          allowNull: true
        }
      });
    }
  }
  Answer.init({
    content: DataTypes.STRING,
    is_accepted: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Answer',
  });
  return Answer;
};