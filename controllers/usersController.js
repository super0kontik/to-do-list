const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const User = require('../models').User;
const Task = require('../models').Task;


module.exports.uPage = async (id,page,filter) =>{
    let params ={
        where:{id:id},
        include:{
            model:Task
        }
    };

    if(filter==='done'){
        params.include.where={
            done:true
        }
    }else if (filter==='undone') {
        params.include.where={
            done:false
        }
    }

    let amount;

    if (isNaN(id) || id==='') {
        return new Error('invalid ID');
    }else{
         amount = await User.findOne(params).then((user)=>{
            if(user===null){
                return new Error('Not found');
            }else {
                return user.dataValues.Tasks.length%5>0?(user.dataValues.Tasks.length/5)+1:user.dataValues.Tasks.length/5;
            }
        });

    }
    params.include.offset=(page*5-5);
    params.include.limit=5;

    let data = await User.findOne(params).then((user)=>{
        return user;
    });

    return {
            amount:amount,
            user:data
            };
};


module.exports.search = async (query) =>{
   return User.findAll({
        where: {name:{[Op.iLike]:`%${query}%`}},
        include:[Task]
    })
        .then((users)=>{
            if(users === []){
                return new Error('Not found');
            }else{
                return users;
            }
        })
};


module.exports.newTask= async (id, content)=>{
    if (isNaN(id) || id==='') {
        return new Error('invalid ID');
    }
    if(content===''){
        return new Error('empty task');
    }else{
       let res = await User.findOne({where:{id:id}})
            .then((user)=>{
                if(user!==null){
                    user.createTask({
                        content: content
                    })
                        .then(()=>{
                            return true;
                        })
                }else{
                    return new Error('Not found')
                }
            });
     return res;
    }
};

module.exports.checkTask = async (id)=>{
    if (isNaN(id) || id==='') {
        return new Error('invalid ID');
    }else{
       return Task.findOne({where:{id:id}})
            .then((task)=>{
                if(task!==null){
                    task.update({done:!task.dataValues.done});
                    return(task.dataValues.done);
                }else{
                    return new Error('Not found');
                }
            })
    }
};


module.exports.delTask = async (id)=>{
    if (isNaN(id) || id==='') {
        return new Error('invalid ID');
    }else{
       return Task.findOne({where:{id:id}})
            .then((task)=>{
                console.log(task);
                if(task!==null){
                    task.destroy();
                    return true;
                }else{
                    return new Error('Not found');
                }
            })
    }
};