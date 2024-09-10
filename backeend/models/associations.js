const User = require('./User');
const Task = require('./Task');

// Define associations here after both models are imported
User.hasMany(Task, { foreignKey: 'user_id' });
Task.belongsTo(User, { foreignKey: 'user_id' });
