import { utilService } from "./util.service.js"

export const bugService = {
    query,
    get,
    save,
    remove
}

const path = './data/bugs.json'
const bugs = utilService.readJsonFile(path)

function query() {
    return Promise.resolve(bugs)
}

function get(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    return Promise.resolve(bug)
}

function save(bugToSave) {
    if (bugToSave._id) {
        const bugIdx = bugs.findIndex(bug => bug._id === bugToSave._id)
        bugs.splice(bugIdx, 1, bugToSave)
    } else {
        bugToSave._id = utilService.makeId()
        bugs.push(bugToSave)
    }

    return _saveBugs()
        .then(() => bugToSave)
}

function remove(bugId) {
    const bugIdx = bugs.findIndex(bug => bug._id === bugId)
    const removedBug = bugs.at(bugIdx)
    bugs.splice(bugIdx, 1)
    return _saveBugs()
        .then(() => removedBug)
}

function _saveBugs() {
    return utilService.writeJsonFile(path, bugs)
}