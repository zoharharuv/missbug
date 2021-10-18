export const bugService = {
    query,
    getById,
    remove,
    add,
    update

}

async function query(filterBy = { filter: '', page: 0 }) {
    var url = '/api/bug';
    // if (filterBy) {
    //     if (filterBy.page < 0) {
    //         url += `?page=${filterBy.page}`
    //     }
    //     if (filterBy.filter) {
    //         url += `&filter=${filterBy.filter}`
    //     }
    // }
    const res = await axios.get(url, { params: { filter: filterBy.filter, page: filterBy.page } })
    return res.data;
}

async function getById(bugId) {
    const res = await axios.get(`/api/bug/${bugId}`)
    return res.data;
}

function remove(bugId) {
    return axios.delete(`/api/bug/${bugId}`)
}

async function add(bug) {
    const res = await axios.post('/api/bug', bug)
    return res.data;
}

async function update(bug) {
    const res = await axios.put('/api/bug', bug)
    return res.data;
}