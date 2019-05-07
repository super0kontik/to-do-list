const express = require('express');
const router = express.Router();
var Sequelize = require('sequelize');
const User = require('../models').User
const Task = require('../models').Task


router.use('',(req,res,next) =>{
  if(req.session.passport === undefined){
    
    return res.sendStatus(401)
  }else if(req.session.passport.user.access==10){

    return next();

  }else {

    return res.sendStatus(401)
  }
})

router.get('/',(req, res, next) => {

  User.findAll({})
  .then((users)=>{
      res.render('adminPanel', {users:users,user:req.session.passport.user});
  })
});

router.put('/changeAccess/:id',(req,res,next)=>{
      User.findOne({
          where:{id:req.params.id}
      })
          .then(usr=>{
              if(usr === null){
                res.sendStatus(404)
                  console.log('fail')
              }else{
                let acs = usr.dataValues.access
                usr.update({ access:(acs===1?10:1)})
                    .then(()=>{
                      console.log('access changed')
                      res.sendStatus(200)
                     })
              }
          })
})

router.delete('/delUser/:id',(req,res,next)=>{
    User.findOne({
        where:{id:req.params.id}
    })
        .then(usr=>{
            if(usr === null){
                res.send('no user with such id')
            }else{

                usr.destroy()
                    .then(()=>{console.log('user deleted id: ',req.params.id)
                    res.sendStatus(200)
                })
            }
        })
})

module.exports = router;
