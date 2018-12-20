class Users {
    constructor() {
        this.users = [];
    }

    addUser(id,name,room) {
        var user = {id,name,room};
        this.users.push(user);
        return user;
    }

    removeUser(id) {
        var user = this.getUser(id);
        if (user){
            this.users = this.users.filter((eachUser) => eachUser.id !== user.id);
        }
        return user;
    }

    getUser(id) {
        
        return this.users.filter((user) => user.id === id)[0];
    }

    getUserList(room) {
        var users = this.users.filter((user) => user.room === room);
        var userNamesArray = users.map((user) => user.name);
        return userNamesArray;
    }
}

module.exports = {Users};