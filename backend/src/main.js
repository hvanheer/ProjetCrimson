const UserService = require('./service/userService');
const UserModel = require('./model/userModel');

async function fetchAllUsers() {
    try {
        const userModelInstance = new UserModel("Guillaume");
        const userService = new UserService();
        // const user1 = await userService.createUser(userModelInstance);
        // console.log(user1);
        const userSearched = await userService.findUserById(3);
        console.log(userSearched);
        console.log(userSearched["ID_user"]);
        console.log(userSearched["user_name"]);
        const allUsers = await userService.findAllUsers();
        console.log(allUsers);
        userService.closeDBConnection();
    } catch (err) {
        console.error('Error fetching all users:', err);
    }
}

fetchAllUsers();
