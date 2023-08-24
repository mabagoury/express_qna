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
        through: 'AnswerUpvoters'
      });

      Answer.belongsToMany(models['User'], {
        as: 'downvoters',
        through: 'AnswerDownvoters'
      });

      Answer.belongsTo(models['Question']);

      Answer.hasMany(models['Comment'], {
        foreignKey: {
          allowNull: false
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