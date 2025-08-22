'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    static associate(models) {
      Task.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    }
  }

  Task.init({
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.TEXT,
    status: {
      type: DataTypes.ENUM('pending', 'in_progress', 'done'),
      defaultValue: 'pending',
    }
  }, {
    sequelize,
    modelName: 'Task',
    tableName: 'tasks',
    underscored: true,
    indexes: [
      { unique: true, fields: ['user_id', 'title'] } // unique per user
    ]
  });

  return Task;
};
