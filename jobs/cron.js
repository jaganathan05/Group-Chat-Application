const sequelize = require("../helper/database");
const Sequelize = require("sequelize");
const Chat = require("../models/chats");
const ArchivedChat = require("../models/archieved_chats");

const job = async (req,res,next) =>{
    try {
        // Runs at 3:27 PM every day
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000); // 1 day ago
    
        // Find chats created more than 24 hours ago
        const chats = await Chat.findAll({
          where: {
            createdAt: {
              [Sequelize.Op.lt]: yesterday,
            },
          },
        });
        
        // Move the found chats to the archived table
        chats.forEach(async (chat) => {
            await ArchivedChat.create({
                name: chat.name,
                message:chat.message,
                userId: chat.userId,
                groupId:chat.groupId
            }
            )
            await Chat.destroy({
                where: {
                  id: chat.id
                  },
                });
        })
          
} catch (error) {
    console.error("Cron Job Error:", error);
  }
}

module.exports = job;
