import { showErrorMsg } from "./event-bus.service.js"

export const userService = {
    query,
    getById
}

const BASE_URL = '/api/user/'

function query() {
    return axios.get(BASE_URL, { params: filterBy })
        .then(res => {
            return res.data
        })
}

function getById(userId) {
    return axios.get(BASE_URL + userId)
        .then(res => {
            return res.data
        })
        .catch(err => {
            console.log('err', err.response.data)
            showErrorMsg(err.response.data)
        })
}

