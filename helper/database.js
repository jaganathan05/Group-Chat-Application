const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_name,process.env.DB_username,process.env.DB_password, {
    dialect:'mysql',
    host:process.env.DB_host,})

    module.exports=sequelize;