import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'
import axios from 'axios'

const BASE_URL = '/api/bug/'

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter
}

function query(filterBy = {}) {
    return axios.get(BASE_URL)
        .then(res => {
            console.log(res)
            return res.data
        })
        .then(bugs => {

            if (filterBy.txt) {
                const regExp = new RegExp(filterBy.txt, 'i')
                bugs = bugs.filter(bug => regExp.test(bug.title))
            }

            if (filterBy.minSeverity) {
                bugs = bugs.filter(bug => bug.severity >= filterBy.minSeverity)
            }

            return bugs
        })
}

function getById(bugId) {
    return axios.get(BASE_URL + bugId)
        .then(res => {
            console.log('res', res)
            return res.data
        })
}

function remove(bugId) {
    return axios.get(BASE_URL + bugId + '/remove')
        .then(res => res.data)
}

function save(bug) {
    const queryParams = `save?title=${bug.title}&severity=${bug.severity}&description=${bug.description}`
    if (bug._id) queryParams + `&id=${bug._id}`

    return axios.get(BASE_URL + queryParams)
        .then(res => res.data)
}

function _createBugs() {
    let bugs = utilService.loadFromStorage(STORAGE_KEY)
    if (bugs && bugs.length > 0) return

    bugs = [
        {
            title: "Infinite Loop Detected",
            description: "The application becomes unresponsive when processing certain requests because a function repeatedly calls itself without reaching a stopping condition.",
            severity: 4,
            _id: "1NF1N1T3"
        },
        {
            title: "Keyboard Not Found",
            description: "The application fails to detect the keyboard after the computer wakes from sleep.",
            severity: 3,
            _id: "K3YB0RD"
        },
        {
            title: "404 Coffee Not Found",
            description: "The coffee ordering page returns a 404 error when users try to access it from the menu.",
            severity: 2,
            _id: "C0FF33"
        },
        {
            title: "Unexpected Response",
            description: "The server occasionally returns an unexpected response format when fetching user data.",
            severity: 1,
            _id: "G0053"
        }
    ]
    utilService.saveToStorage(STORAGE_KEY, bugs)
}

function getDefaultFilter() {
    return { txt: '', minSeverity: 0 }
}