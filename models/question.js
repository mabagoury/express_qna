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
        as: 'author'
      });

      Question.belongsToMany(models['User'], {
        as: 'upvoters',
        through: 'QuestionUpvoters'
      });

      Question.belongsToMany(models['User'], {
        as: 'downvoters',
        through: 'QuestionDownvoters'
      });

      Question.hasMany(models['Answer'], {
        foreignKey: {
          allowNull: false
        }
      });

      Question.hasMany(models['Comment'], {
        foreignKey: {
          allowNull: false
        }
      });

      Question.belongsToMany(models['Tag'], {
        through: 'QuestionTag'
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