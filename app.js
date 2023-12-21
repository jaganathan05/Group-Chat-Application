const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./helper/database');
const path = require('path');
const cors = require('cors');

const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const fs = require('fs');


const socketIO = require('socket.io')
require('dotenv').config();
const CronJob = require('cron').CronJob;
const cronejob = require('./jobs/cron');

const job = new CronJob('1 0 * * *', () => {
  cronejob();
});

job.start();



// models
const User = require('./models/users');
const Chats = require('./models/chats');
const Groups = require('./models/group');
const UserGroup = require('./models/usergroup');
const archieved_chats = require('./models/archieved_chats');

// routers
const user_routes = require('./router/user_routes');
const chat_routes = require('./router/chat_routes');
const group_routes = require('./router/grouprouter');

const app = express();
const port = 3000;




app.use(express.json());
app.use(bodyParser.json())
// Use express.urlencoded for parsing URL-encoded data
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors({ origin: '*' }));
app.use(express.static(path.join(__dirname, 'public')));





// relationships between Tables
User.hasMany(Chats);
Chats.belongsTo(User);

User.hasMany(Groups);
Groups.belongsTo(User);

Groups.hasMany(UserGroup,{ onDelete: 'CASCADE' ,hooks: true});
UserGroup.belongsTo(Groups );

Groups.hasMany(Chats,{ onDelete: 'CASCADE' ,hooks: true});
Chats.belongsTo(Groups);

User.hasMany(UserGroup);
UserGroup.belongsTo(User);

User.hasMany(archieved_chats);
archieved_chats.belongsTo(User);

Groups.hasMany(archieved_chats,{ onDelete: 'CASCADE' ,hooks: true});
archieved_chats.belongsTo(Groups)


// Use your routers
app.use(user_routes);
app.use('/chat', chat_routes);
app.use(group_routes);

app.use(helmet());// set secure headers

const accessLogStream = fs.createWriteStream(
    path.join(__dirname,'access.log'),
    {flags: 'a'}
)

app.use(compression());
app.use(morgan('combined',{stream:accessLogStream }));

sequelize.sync().then(() => {
  app.listen(port)
  console.log('Database synchronized');
});
