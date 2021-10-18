
const STORAGE_KEY = 'loggedinUser'
export const userService = {
    getLoggedinUser,
    login,
    logout,
    signup,
    getById,
    getUsers,
    deleteUser
}


async function signup(credentials) {
    const res = await axios.post('/api/login', credentials)
    const user = res.data
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    return user
}

async function login(credentials) {
    const res = await axios.post('/api/login', credentials)
    const user = res.data
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    return user
}

async function logout() {
    await axios.post('/api/logout')
    sessionStorage.removeItem(STORAGE_KEY)
}

async function getById(userId) {
    const res = await axios.get(`/api/user/${userId}`)
    return res.data;
}

async function deleteUser(userId) {
    const res = await axios.delete(`/api/user/${userId}`)
    return res.data;
}

async function getUsers() {
    const res = await axios.get(`/api/usertable`)
    return res.data;
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY))
}

