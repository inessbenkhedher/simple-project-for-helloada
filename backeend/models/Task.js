const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js'); // Import your sequelize instance

const Task = sequelize.define('Task', {
    title: {
        type: DataTypes.STRING,
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false
});

module.exports = Task;
