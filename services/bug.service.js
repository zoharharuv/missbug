const DBService = require('./db.service')
const PAGE_SIZE = 3;

function query(filterBy = {}) {
    var orderBy = filterBy.filter || '_id';
    if (filterBy.page < 0) filterBy.page = 0;
    const startIdx = filterBy.page * PAGE_SIZE;
    var query = `SELECT * FROM bug ORDER BY ${orderBy} LIMIT ${PAGE_SIZE} OFFSET ${startIdx}`;
    return DBService.runSQL(query)
}

async function getUserBugs(userId) {
    // GET BUG COUNT
    var query = `SELECT count(*) AS "items" FROM bug WHERE bug.creator_id = ${userId}`;
    const bugs = await DBService.runSQL(query)
    return bugs[0].items
}

async function getById(bugId) {
    var query = `SELECT * FROM bug WHERE bug._id = ${bugId}`;

    var bugs = await DBService.runSQL(query);
    if (bugs.length === 1) return bugs[0];
    throw new Error(`bug id ${bugId} not found`);

    // const bug = gBugs.find(bug => bug._id === bugId)
    // return Promise.resolve(bug)
}

async function remove(bugId, user) {
    var query = `DELETE FROM bug WHERE bug._id = ${bugId}`;

    const okPacket = await DBService.runSQL(query)
    okPacket.affectedRows === 1 ? Promise.resolve(okPacket) : Promise.reject(new Error(`No bug deleted - bug id ${bugId}`))
    // var idx;
    // (user.is_admin) ? idx = gBugs.findIndex(bug => bug._id === bugId)
    //     : idx = gBugs.findIndex(bug => bug._id === bugId && bug.creator === user.username);
    // if (idx === -1) {
    //     return Promise.reject('Cannot remove Bug')
    // }
    // gBugs.splice(idx, 1)
    // return _saveBugsToFile()
}

async function save(bug) {
    if (bug._id) {
        // if (!user.is_admin) {
        //     if (user.username !== gBugs[idx].creator) return Promise.reject('wrong user')
        // }
        var query = `UPDATE bug set name = "${bug.name}",
        description = "${bug.description}",
        severity = ${bug.severity}
        WHERE bug._id = ${bug._id}`;

        var okPacket = await DBService.runSQL(query);
        if (okPacket.affectedRows === 0) throw new Error(`No bug updated - bug id ${bug._id}`);
    } else {
        var sqlCmd = `INSERT INTO bug (name, description, severity, creator, creator_id) 
        VALUES ("${bug.name}",
                "${bug.description}",
                "${bug.severity}",
                "${bug.creator}",
                "${bug.creator_id}")`;

        const { insertId } = await DBService.runSQL(sqlCmd)
        bug._id = insertId;
    }
    return bug;
}

module.exports = {
    query,
    getById,
    remove,
    save,
    getUserBugs
}
