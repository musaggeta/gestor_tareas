module.exports = (sequelize, DataTypes) => {
    const Task = sequelize.define('Task', {
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT },
      status: {
        type: DataTypes.ENUM('pendiente', 'en progreso', 'completada'),
        defaultValue: 'pendiente'
      },
      dueDate: { type: DataTypes.DATE }
    });
  
    Task.associate = (models) => {
      Task.belongsTo(models.User, { foreignKey: 'userId' });
    };
  
    return Task;
  };

