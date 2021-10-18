const DBService = require('./db.service')

async function checkCredentials(credentials) {
    var result;
    if (credentials.fullname) {
        // SIGNUP
        result = addUser(credentials)
    }
    else {
        // CHECK LOGIN
        var sqlCmd = `SELECT * FROM user WHERE username='${credentials.username}' AND password='${credentials.password}'`;
        const user = await DBService.runSQL(sqlCmd)
        result = user[0]
    }
    return Promise.resolve(result);
}

async function addUser({ username, password, fullname }) {
    // CHECK SIGNUP
    var sqlCmd = `SELECT * FROM user WHERE username='${username}'`;
    const isExist = await DBService.runSQL(sqlCmd)
    if (isExist.length > 0) return false;
    // MAKE NEW USER
    const user = {
        username,
        password,
        fullname
    }
    sqlCmd = `INSERT INTO user (username, fullname, password) 
    VALUES ("${user.username}",
            "${user.fullname}",
            "${user.password}")`;

    const { insertId } = await DBService.runSQL(sqlCmd)
    user._id = insertId;
    return user;
}

async function getById(userId) {
    var query = `SELECT * FROM user WHERE user._id = ${userId}`;

    var users = await DBService.runSQL(query);
    if (users.length === 1) {
        const user = users[0];
        delete user.password;
        return user;
    }
    throw new Error(`user id ${userId} not found`);
}

async function getAllUsers() {
    var query = `SELECT _id, username, fullname FROM user`;
    const users = await DBService.runSQL(query);
    return users;
}

async function deleteUserById(userId, currUserId) {
    var query = `DELETE FROM user WHERE user._id = ${userId}`;
    const okPacket = await DBService.runSQL(query)
    okPacket.affectedRows === 1 ? Promise.resolve(okPacket) : Promise.reject(new Error(`No bug deleted - bug id ${bugId}`))
}

module.exports = {
    checkCredentials,
    getById,
    getAllUsers,
    deleteUserById
}
