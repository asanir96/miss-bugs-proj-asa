import { showErrorMsg } from "./event-bus.service.js"

export const userService = {
    query,
    getById,
    remove
}

const BASE_URL = '/api/user/'

function query(filterBy={}) {
    return axios.get(BASE_URL)
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

function remove(userId) {
    return axios.delete(BASE_URL + userId + '/')
        .then(res => res.data)
}