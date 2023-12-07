const Sequelize= require('sequelize');
const sequelize = require('../helper/database');

const usergroup = sequelize.define('usergroups',{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    isadmin:{
        type: Sequelize.STRING,
        allowNull:false
    }
})

module.exports= usergroup;