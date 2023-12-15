const Sequelize= require('sequelize');
const sequelize = require('../helper/database');

const oldchats = sequelize.define('oldchats',{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name:{
        type: Sequelize.STRING,
        allowNull:false
    },
    message:{
        type: Sequelize.STRING,
        allowNull:false
    }
})

module.exports= oldchats;