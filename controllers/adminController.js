const User = require('../models').User;

module.exports.changeAccess = async (id)=>{
    return User.findOne({
        where:{id:id}
    })
        .then(usr=>{
            if(usr === null){
                return false;
            }else{
                let acs = usr.dataValues.access;
                usr.update({ access:(acs===1?10:1)})
                    .then(()=>{
                        return true;
                    })
            }
        })
};


module.exports.delUser = async (id)=>{
    return User.findOne({
        where:{id:id}
    })
        .then(usr=>{
            if(usr === null){
                return false;
            }else{
                usr.destroy()
                    .then(()=>{
                        return true;
                    })
            }
        })
};