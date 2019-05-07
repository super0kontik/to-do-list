var express = require('express');
var router = express.Router();
const User = require('../models').User
const passport = require('passport')
const jwt = require('jsonwebtoken');

router.get('/',(req,res)=>{

  res.render('login')
})

router.get('/logout',(req,res)=>{
  //req.logOut();// WRONG!!!
  req.session.destroy(function() {
    res.clearCookie('connect.sid');
    console.log('logging out:',req.session);
    res.redirect('/');
});
})


router.post('/login',(req,res)=>{

  let data={
    where:{name:req.body.uName,
    password:req.body.pword},
    attributes:['id','name']
  }
  
  User.findOne(data)
    .then((usr)=>{
      if(usr===null){
        res.redirect('/')
      }else {
          const at = jwt.sign({usr},"secretkey",{expiresIn:10})
          const rt = jwt.sign({usr},"anotherSecretkey",{expiresIn:50})
          usr.update({refreshToken:rt})
          .then(()=>{

            req.session.passport={user:{
              id:usr.id,
              name:usr.name,
              access:usr.access,
              accessToken:at,
              refreshToken:rt
            }}
            console.log(' tokens updated');
            res.redirect('/user/'+usr.id)
          })
      }
    })
});


router.post('/register',(req,res)=>{
    function generateId() {
        let id=String(Math.abs((Math.random()*1000 - Math.random()*10 + Math.random()))*1000000).slice(0,7)
        console.log(id)
        return id
    }
    let id = generateId()
          if(req.body.pword!=req.body.pwordConfirm||req.body.pword.trim().length<8||req.body.uName.trim().length<3){
            return res.send('wrong registration data')
          }
                    const data = {
                        id:id,
                        name: req.body.uName.trim(),
                        password:req.body.pword.trim()
                    };
                    console.log(data);
                      User.findOne({
                        where: {
                            name: data.name
                        }
                      }).then(user => {
                        if(user===null){
                              User.create(data)
                                .then((usr)=>{
                                  res.redirect(`/`);
                                })
                        }else {
                            res.send('user already exists')
                        }
                    });
})

router.get('/google',passport.authenticate('google',
{
  scope:['profile']
}))

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  //console.log('\n ---req.user IN AUTH ROUTES : ', req.user);

  User.findOne({where:{id:req.user.id}}).then(users => {
    //console.log(users);
  if(users===null){
    User.create({id:req.user.id,name:req.user.displayName})
    .then((usr)=>{
      //console.log('new user`s id: ',usr.id);
      res.redirect('/')
    })
  }else{
    req.session.passport.user=users.dataValues
    res.redirect(`/user/${req.user.id}`);
  }
});
});
// TEST ONLY
router.get('/adminMode',(req,res)=>{
  req.session.passport={user:{id:1,name:'Admin',access:10}}
  res.redirect('/')
})

module.exports = router
