const Sequelize= require('sequelize');
const sequelize = require('../helper/database');

const group = sequelize.define('groups',{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name:{
        type: Sequelize.STRING,
        allowNull:false
    }
})

module.exports= group;