'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('CommentDownvoters', {
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      commentId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'Comments',
            schema: 'public'
          },
          key: 'id'
        },
        allowNull: false,
        primaryKey: true
      },
      downvoterId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'Users',
            schema: 'public'
          },
          key: 'id'
        },
        allowNull: false,
        primaryKey: true
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('CommentDownvoters');
  }
};
