const express = require('express');
const router = express.Router();
var Sequelize = require('sequelize');
const User = require('../models').User
const Task = require('../models').Task

const Op = Sequelize.Op;

router.get('/', function(req, res, next) {
  if(req.session.passport!==undefined){
    res.redirect('/user/'+req.session.passport.user.id)
  }else{
    res.redirect('auth')
  }
});



router.get('/user/:id', (req, res, next)=> {
  let page=((req.query.page==undefined||req.query.page<=0)? 1 :req.query.page);
  let filter = (req.query.filter==undefined? 'all' :req.query.filter)
  let params ={
    where:{id:req.params.id},
    include:{
      model:Task
    }
}
if(filter=='done'){
  params.include.where={
      done:true
    }
}else if (filter=='undone') {
  params.include.where={
      done:false
    }
}

  req.session.lastUrl='/user/'+req.params.id
  if (isNaN(req.params.id)) {
    res.sendStatus(404)
  }else{
  if(req.params.id==''){
    res.redirect('/')
  }else{
  let amount

    User.findOne(params).then((user)=>{
        if(user===null){
          res.sendStatus(404)
        }else {
         amount = (user.dataValues.Tasks.length%5>0?user.dataValues.Tasks.length/5+1:user.dataValues.Tasks.length)
        }
      })

    params.include.offset=(page*5-5),
    params.include.limit=5

    User.findOne(params).then((user)=>{
        if(user===null){
          res.sendStatus(404)
        }else {
          res.render('user',{name: user.dataValues.name, user:user,userName:(req.session.passport===undefined?{name:null,access:0}:req.session.passport.user),filter:filter,page:page,amount:amount})
        }
      })
      }
    }
});



router.get('/search', function(req, res, next) {
  let query=req.query.q
  if(query == ''){
    res.redirect('/')
  }else{
    User.findAll({
      where: {name:{[Op.iLike]:`%${query}%`}},
      include:[Task]
    })
    .then((users)=>{
      if(users === []){
        res.sendStatus(404)
      }else{
        res.render('index',{name: "Результат поиска по "+query, users:users, user:(req.session.passport===undefined?{name:null,access:0}:req.session.passport.user)})
      }
    })
  }
});


router.post('/newTask/:id',isAllowed,(req,res,next)=>{
  if(req.body.content===''){
    res.send('empty task error')
  }else{
  User.findOne({where:{id:req.params.id}})
  .then((user)=>{
      if(user!==null){
        user.createTask({
        content: req.body.content
      }).then(()=>{
        res.redirect(req.session.lastUrl)
      })
    }else{
      res.send("wrong name")
    }
  })
}
})



router.put('/checkTask/:id',isAllowed,(req,res,next)=>{
  if (isNaN(req.params.id)) {
    res.sendStatus(404)
  }else{
    Task.findOne({where:{id:req.params.id}})
    .then((task)=>{
      console.log(task);
      if(task!==null){
        task.update({done:!task.dataValues.done})
        res.send(task.dataValues.done)
      }else{
        res.sendStatus(404)
      }
    })
  }
})



router.delete('/delTask/:id',isAllowed,(req,res,next)=>{
  if (isNaN(req.params.id)) {
    res.sendStatus(204)
  }else{
    Task.findOne({where:{id:req.params.id}})
    .then((task)=>{
      console.log(task);
      if(task!==null){
        task.destroy()
      }else{
        res.sendStatus(204)
      }
    })
  }
})

function isAllowed(req,res,next){
  if(req.session.passport === undefined){
    return res.sendStatus(403)
  }else if(req.session.passport.user.access==10){
    return next();
  }else {
  checkRights()

  }

  function checkRights() {

    if(req.params.id !== undefined){
      if(req.session.lastUrl.slice(6) == req.session.passport.user.id ){

          return next()
      }else{
        return res.sendStatus(403)
      }
    }else{
      return res.sendStatus(403)
    }
  }
}

module.exports = router;
