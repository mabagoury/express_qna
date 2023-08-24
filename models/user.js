'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models['Question'], {
        foreignKey: {
          name: 'authorId',
          allowNull: false
        }
      });

      User.hasMany(models['Answer'], {
        foreignKey: {
          name: 'authorId',
          allowNull: false
        }
      });

      User.hasMany(models['Comment'], {
        foreignKey: {
          name: 'authorId',
          allowNull: false
        }
      });

      User.belongsToMany(models['Question'], {
        as: 'QuestionUpvotes',
        through: 'QuestionUpvoter',
      });

      User.belongsToMany(models['Answer'], {
        as: 'AnswerUpvotes',
        through: 'AnswerUpvoter',
      });

      User.belongsToMany(models['Comment'], {
        as: 'CommentUpvotes',
        through: 'CommentUpvoter',
      });

      User.belongsToMany(models['Question'], {
        as: 'QuestionDownvotes',
        through: 'QuestionDownvoter',
      });

      User.belongsToMany(models['Answer'], {
        as: 'AnswerDownvotes',
        through: 'AnswerDownvoter',
      });

      User.belongsToMany(models['Comment'], {
        as: 'CommentDownvotes',
        through: 'CommentDownvoter',
      });
    }
  }
  User.init({
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    age: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};