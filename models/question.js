'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Question.belongsTo(models['User'], {
        as: 'author',
        foreignKey: {
          name: 'authorId',
          allowNull: false
        }
      });

      Question.belongsToMany(models['User'], {
        as: 'upvoters',
        through: 'QuestionUpvoters',
        foreignKey: 'questionId',
        otherKey: 'upvoterId'
      });

      Question.belongsToMany(models['User'], {
        as: 'downvoters',
        through: 'QuestionDownvoters',
        foreignKey: 'questionId',
        otherKey: 'downvoterId'
      });

      Question.hasMany(models['Answer'], {
        foreignKey: {
          name: 'questionId',
          allowNull: false
        }
      });

      Question.hasMany(models['Comment'], {
        foreignKey: {
          name: 'questionId',
          allowNull: true
        }
      });

      Question.belongsToMany(models['Tag'], {
        through: 'QuestionTag',
        foreignKey: 'questionId',
        otherKey: 'tagId'
      });
    }
  }
  Question.init({
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    views: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Question',
  });
  return Question;
};