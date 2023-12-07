const express = require('express');
const body_parser= require('body-parser');
const sequelize = require('./helper/database');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

//models
const User = require('./models/users');
const Chats = require('./models/chats');
const Groups = require('./models/group');
const UserGroup = require('./models/usergroup');

//routers
const user_routes= require('./router/user_routes');
const chat_routes = require('./router/chat_routes');
const group_routes = require('./router/grouprouter');


const app= express();
app.use(express.json())

app.use(user_routes)
app.use('/chat',chat_routes);
app.use(group_routes);

app.use(body_parser.urlencoded({ extended: false }));
app.use(cors({
    origin: "*"
}));
app.use(express.static(path.join(__dirname,'public')))

//relationship between Tables

User.hasMany(Chats,{ onDelete: "CASCADE"})
Chats.belongsTo(User);

User.hasMany(Groups);
Groups.belongsTo(User);

Groups.hasMany(UserGroup);
UserGroup.belongsTo(Groups);

Groups.hasMany(Chats)
Chats.belongsTo(Groups)

User.hasMany(UserGroup);
UserGroup.belongsTo(User);

sequelize.sync().then(()=>{
    app.listen(3000);
})

