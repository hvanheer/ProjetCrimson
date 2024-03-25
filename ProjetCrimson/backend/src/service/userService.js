const userModel = require('../model/userModel');
const userDAO = require('../dao/userDAO');

class userService{
    constructor() {
        this.userModel = userModel;
        this.userDAO = userDAO;
    }

    // Mettre aussi sous forme de fonctions ou laisser en promesses ?

    async findUserById(){
        try{
            const user = await this.userDAO.findUserById();
            return user;
        }catch (err){
            throw err;
        }
    }
    async findAllUsers(){
        try{
            const users = await this.userDAO.findAllUser();
            return users;
        }catch (err){
            throw err;
        }
    }

}