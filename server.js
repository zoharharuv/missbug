const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session')

const bugService = require('./services/bug.service')
const userService = require('./services/user.service')

const path = require('path')
const PORT = process.env.PORT || 3030

// Create and Configure the Express App
const app = express()

app.use(cookieParser())
app.use(express.json())
app.use(express.static('public'))
app.use(session({
    secret: 'some secret string',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

// --- BUG API ---
// LIST
app.get('/api/bug', async (req, res) => {
    // localhost:3030/api/bug?page=3&filter=tamir
    const filter = (req.query);
    const bugs = await bugService.query(filter)
    res.send(bugs)
})

// CREATE
app.post('/api/bug', async (req, res) => {
    const { loggedinUser } = req.session;
    if (!loggedinUser) {
        res.status(401).send('Please login first')
        return;
    }
    const bug = {
        name: req.body.name,
        description: req.body.description,
        severity: +req.body.severity,
        creator: loggedinUser.username,
        creator_id: loggedinUser._id
    }
    const savedBug = await bugService.save(bug)
    res.send(savedBug)
})

// UPDATE
app.put('/api/bug', async (req, res) => {
    const { loggedinUser } = req.session;
    if (!loggedinUser) {
        res.status(401).send('Please login first')
        return;
    }
    const bug = {
        _id: req.body._id,
        name: req.body.name,
        description: req.body.description,
        severity: +req.body.severity,
        creator: req.body.creator,
        creator_id: loggedinUser._id,
        created_at: req.body.created_at
    }
    try {
        const savedBug = await bugService.save(bug, loggedinUser)
        res.send(savedBug)
    } catch (err) {
        res.status(403).send(err)
    }
})

// READ
app.get('/api/bug/:bugId', async (req, res) => {
    const { bugId } = req.params
    const bug = await bugService.getById(bugId)
    res.send(bug)
})

// DELETE
app.delete('/api/bug/:bugId', async (req, res) => {
    const { loggedinUser } = req.session;
    if (!loggedinUser) {
        res.status(401).send('Please login first')
        return;
    }
    const { bugId } = req.params
    try {
        await bugService.remove(bugId, loggedinUser)
        res.send('Deleted')
    } catch (err) {
        res.status(403).send('Cannot remove Bug')
    }
})

//--- USER API ---

// LOGIN
app.post('/api/login', async (req, res) => {
    const credentials = req.body
    const user = await userService.checkCredentials(credentials)
    if (user) {
        req.session.loggedinUser = user;
        const userToSend = {
            _id: user._id,
            fullname: user.fullname,
            username: user.username
        }
        if (user.is_admin) userToSend.is_admin = true;
        res.send(userToSend)
    } else {
        res.status(401).send('Invalid username/password');
    }
})

// LOGOUT
app.post('/api/logout', (req, res) => {
    req.session.destroy()
    res.send()
})

// GET USERBYID
app.get('/api/user/:userId', async (req, res) => {
    const { loggedinUser } = req.session;
    if (!loggedinUser) {
        res.status(401).send('Please login first')
        return;
    }
    const { userId } = req.params
    var userToSend;
    const user = await userService.getById(userId)
    userToSend = user;
    const bugCount = await bugService.getUserBugs(userId)
    res.send({ user: userToSend, bugCount })
})

// USER TABLE - ADMIN FUNCS
// GET ALL USERS
app.get('/api/usertable', async (req, res) => {
    const { loggedinUser } = req.session;
    if (!loggedinUser || !loggedinUser.is_admin) {
        res.status(401).send('Please login first')
        return;
    }
    const users = await userService.getAllUsers()
    res.send(users)
})

// DELETE USER BY ID
app.delete('/api/user/:userId', async (req, res) => {
    const { loggedinUser } = req.session;
    if (!loggedinUser || !loggedinUser.is_admin) {
        res.status(401).send('Please login first')
        return;
    }
    const { userId } = req.params
    try {
        const users = await userService.deleteUserById(userId, loggedinUser._id)
        res.send(users)
    } catch (err) {
        res.status(403).send(err)
    }
})

app.get('/**', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.listen(PORT, () => console.log('Server listening on port:', PORT))



