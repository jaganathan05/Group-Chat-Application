const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./helper/database');
const path = require('path');
const cors = require('cors');
const socketIO = require('socket.io')
require('dotenv').config();




// models
const User = require('./models/users');
const Chats = require('./models/chats');
const Groups = require('./models/group');
const UserGroup = require('./models/usergroup');

// routers
const user_routes = require('./router/user_routes');
const chat_routes = require('./router/chat_routes');
const group_routes = require('./router/grouprouter');

const app = express();
const port = 3000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({ origin: '*' }));
app.use(express.static(path.join(__dirname, 'public')));






// relationships between Tables
User.hasMany(Chats, { onDelete: 'CASCADE' });
Chats.belongsTo(User);

User.hasMany(Groups);
Groups.belongsTo(User);

Groups.hasMany(UserGroup);
UserGroup.belongsTo(Groups);

Groups.hasMany(Chats);
Chats.belongsTo(Groups);

User.hasMany(UserGroup);
UserGroup.belongsTo(User);




// Use your routers
app.use(user_routes);
app.use('/chat', chat_routes);
app.use(group_routes);

sequelize.sync().then(() => {
  app.listen(port)
  console.log('Database synchronized');
});
