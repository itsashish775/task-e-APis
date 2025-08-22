'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tasks', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE'
      },
      title: { type: Sequelize.STRING, allowNull: false },
      description: Sequelize.TEXT,
      status: {
        type: Sequelize.ENUM('pending', 'in_progress', 'done'),
        defaultValue: 'pending'
      },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    // unique per user
    await queryInterface.addConstraint('tasks', {
      fields: ['user_id', 'title'],
      type: 'unique',
      name: 'unique_user_task_title'
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('tasks');
  }
};
