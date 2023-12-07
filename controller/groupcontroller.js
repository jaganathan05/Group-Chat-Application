const path = require('path');
const sequelize = require('../helper/database');
const { Op } = require('sequelize');
const Group = require('../models/group');
const User = require('../models/users');
const UserGroup = require('../models/usergroup');
const usergroup = require('../models/usergroup');

exports.createGroup = async (req, res, next) => {
  const t = await sequelize.transaction();
  const tUserGroup = await sequelize.transaction();

  try {
    const { Groupname, MembersArray } = req.body;


    const createGroup = await Group.create(
      {
        name: Groupname,
        userId: req.user.id,
      },
      { transaction: t }
    );

    await t.commit();

    const invitedMembers = await User.findAll({
      where: {
        email: {
          [Op.or]: MembersArray,
        },
      },
      transaction: tUserGroup,
    });

    invitedMembers.forEach(async (member) => {
      await UserGroup.create(
        {
          isadmin: 'false',
          userId: member.id,
          groupId: createGroup.id,
        },
        { transaction: tUserGroup }
      );
    });

    await UserGroup.create(
      {
        isadmin: 'true',
        userId: req.user.id,
        groupId: createGroup.id,
      },
      { transaction: tUserGroup }
    );

    await tUserGroup.commit();

    res.status(201).json({ message: 'Group created successfully' });
  } catch (error) {
    console.error(error);

    await t.rollback();
    await tUserGroup.rollback();

    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.GetGroups=async(req,res,next)=>{

  try{
      const usergroups = await usergroup.findAll({
        where:{
          userId: req.user.id
        }
      })

      const groupids = usergroups.map((usergroup)=> usergroup.groupId); 

      const getgroups = await Group.findAll({

        where:{
          id:groupids
        }
      })

      res.status(200).json({success: true , Groups : getgroups })
  }
  catch{

  }



}