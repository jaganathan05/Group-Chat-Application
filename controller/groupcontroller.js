const path = require('path');
const sequelize = require('../helper/database');
const { Op } = require('sequelize');
const Group = require('../models/group');
const User = require('../models/users');
const UserGroup = require('../models/usergroup');
const user = require('../models/users');

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
      const usergroups = await UserGroup.findAll({
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
  catch(err){
    console.log(err)
  }

}
exports.Get_Group_Members=async (req,res,next)=>{
  const groupId = req.query.groupId;
  const t = await sequelize.transaction();
  const userid = req.user.id;
  try{

    const groupmembers= await UserGroup.findAll({
      where: {
        groupId: groupId
      },
      transaction:t
    })

    const group_member_ids = groupmembers.map((member)=>member.userId);
    const admin = groupmembers.reduce((acc, member) => {
      acc[member.userId] = member.isadmin;
      return acc;
    }, {});
    
    console.log(admin);
    

    const memberdetails =  await User.findAll({
      where:{
        id: group_member_ids
      },
      transaction:t
    })
    await t.commit();
    res.status(200).json({success:true, Members : memberdetails, admindetails: admin, userid})
  }
  catch(err){
    await t.rollback();
    console.log(err)

  }

}

exports.AddnewMember = async (req, res, next) => {
  const t =await sequelize.transaction();
  try {
    const emails = req.body.emailarray;
    const group_id = req.query.groupid;
    const UserId = req.user.id;

    const checkadmin = await UserGroup.findOne({
      where: {
        isadmin:'true',
        userId: UserId,
        groupId: group_id
      }
    });
    console.log(checkadmin)
    if (checkadmin) {
      const users = await User.findAll({
        where:{
          email: {
            [Op.or]: emails,
          }
        },transaction:t
      })
  
      await Promise.all(users.map(async (user) => {
        await UserGroup.create({
          isadmin: 'false',
          userId: user.id,
          groupId: group_id
        }, { transaction: t });
      }));
      
      
      
      await t.commit()
      return res.status(201).json({success:true,message: 'new members added' })
    }
    else{
      return res.status(200).json({success:true, message: 'You are not admin for this Group' });
    }

    
  } catch (error) {
    await t.rollback()
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.Makeadmin = async (req, res, next) => {
  try {
    const { userid, groupId } = req.body;
    const adminuserid = req.user.id;

    const checkadmin = await UserGroup.findOne({
      where: {
        isadmin:'true',
        userId: adminuserid,
        groupId: groupId
      }
    });

    if (checkadmin) {
      const makeadmin = await UserGroup.update(
        { isadmin: 'true' },
        {
          where: {
            userId: userid,
            groupId: groupId
          }
        }
      );
  
      if (makeadmin) {
        return res.status(200).json({ success: true, message: 'Admin status updated' });
      }
    }
    else{
      return res.status(200).json({ success: false, message: 'You are not admin for this Group' });
    }
    

    
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Something went wrong' });
  }
};
exports.RemoveMember =async (req,res,next)=>{
  try {
    const { userid, groupId } = req.body;
    const adminuserid = req.user.id;

    const checkadmin = await UserGroup.findOne({
      where: {
        isadmin:'true',
        userId: adminuserid,
        groupId: groupId
      }
    });

    if (checkadmin) {
      const DeleteMember = await UserGroup.destroy(
        {
          where: {
            userId: userid,
            groupId: groupId
          }
        }
      );
  
      if (DeleteMember) {
        return res.status(200).json({ success: true, message: 'Member Removed' });
      }
    }
    else{
      return res.status(200).json({ success: false, message: 'You are not admin for this Group' });
    }
    

    
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Something went wrong' });
  }

}

exports.RemoveAdmin=async (req,res,next)=>{
  try {
    const { userid, groupId } = req.body;
    const adminuserid = req.user.id;

    const checkadmin = await UserGroup.findOne({
      where: {
        isadmin:'true',
        userId: adminuserid,
        groupId: groupId
      }
    });

    if (checkadmin) {
      const makeadmin = await UserGroup.update(
        { isadmin: 'false' },
        {
          where: {
            userId: userid,
            groupId: groupId
          }
        }
      );
  
      if (makeadmin) {
        return res.status(200).json({ success: true, message: 'Admin status updated' });
      }
    }
    else{
      return res.status(200).json({ success: false, message: 'You are not admin for this Group' });
    }
    

    
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Something went wrong' });
  }
}