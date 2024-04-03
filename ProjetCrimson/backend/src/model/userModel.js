class UserModel {

    constructor(name){
        this.id = 0;
        this.name = name;
    }

    updateName(newName) {
        this.name = newName;
    }

    getUserDetails() {
        return { id: this.id, name: this.name };
    }
}

module.exports = UserModel;
