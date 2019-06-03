const User = require('../models').User;
const jwt = require('jsonwebtoken');

module.exports.login = async (name,password)=>{
    let data={
        where:{
            name:name,
            password:password
            },
        attributes:['id','name','access']
    };

    return User.findOne(data)
        .then((usr)=>{
            if(usr===null){
                return 'user not found';
            }else {
                const at = jwt.sign({usr},"secretkey",{expiresIn:10});
                const rt = jwt.sign({usr},"anotherSecretkey",{expiresIn:50});
                return usr.update({refreshToken:rt})
                    .then(()=>{
                        return {user:{
                                id:usr.id,
                                name:usr.name,
                                access:usr.access,
                                accessToken:at,
                                refreshToken:rt
                            }};
                    })
            }
        })
};


module.exports.register = async (uName,pword,pwordConfirm)=>{

    function generateId() {
        let id=String(Math.abs((Math.random()*1000 - Math.random()*10 + Math.random()))*1000000).slice(0,7)
        console.log(id);
        return id
    }

    let id = generateId();

    if(pword!==pwordConfirm ||pword.trim().length<8||uName.trim().length<3){
        return'wrong registration data';
    }

    const data = {
        id:id,
        name: uName.trim(),
        password:pword.trim()
    };

    return User.findOne({
        where: {
            name: data.name
        }
    })
        .then(user => {
        if(user===null){
            return User.create(data)
                .then(()=>{
                    return true;
                })
        }else {
            return 'user already exists';
        }
    });
};