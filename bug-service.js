import { utilService } from "./util.service.js"

export const bugService = {
    query,
    get,
    save,
    remove
}

const PAGE_SIZE = 3


const path = './data/bugs.json'
const bugs = utilService.readJsonFile(path)

function query(filterBy = {}) {
    let filteredBugs = [...bugs]
    const uniqueLabels = _getUniqueLabels(filteredBugs)

    if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, 'i')
        filteredBugs = filteredBugs.filter(bug => regExp.test(bug.title) || regExp.test(bug.description))
    }

    if (filterBy.minSeverity) {
        filteredBugs = filteredBugs.filter(bug => bug.severity >= filterBy.minSeverity)
    }

    // TODO: Change guard to use optional chaining
    if (filterBy.labels) {
        filteredBugs = filterBy.labels.length ?
            filteredBugs.filter(bug => {
                if (bug.labels) return bug.labels.some(label => filterBy.labels.includes(label))
                else return false
            }) : filteredBugs
    }

    if (filterBy.sortBy) {
        filteredBugs = _sortBugs(filteredBugs, filterBy.sortBy, filterBy.sortDir ? filterBy.sortDir : 1)
    }

    let startIdx
    const lastPageIdx = Math.ceil(filteredBugs.length / PAGE_SIZE) - 1

    if (filterBy.pageIdx > lastPageIdx) {
        startIdx = 0
    } else if (filterBy.pageIdx < 0) {
        startIdx = (Math.ceil(filteredBugs.length / PAGE_SIZE) - 1) * PAGE_SIZE
    } else {
        startIdx = filterBy.pageIdx * PAGE_SIZE
    }

    const endIdx = startIdx + PAGE_SIZE
    filteredBugs = filteredBugs.slice(startIdx, endIdx)

    //TODO: Change fieldnames to be not strings
    return Promise.resolve({ 'filteredBugs': filteredBugs, 'lastPageIdx': lastPageIdx, 'uniqueLabels': uniqueLabels })
}

function get(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    return Promise.resolve(bug)
}

function save(bugToSave) {
    if (bugToSave._id) {
        const bugIdx = bugs.findIndex(bug => bug._id === bugToSave._id)
        const updatedBug = { ...bugs[bugIdx], ...bugToSave }
        bugs.splice(bugIdx, 1, updatedBug)
    } else {
        bugToSave._id = utilService.makeId()
        bugToSave.createdAt = Date.now()
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

function _sortBugs(bugs, sortBy, sortDir) {
    let sortedBugs = [...bugs]

    if (sortBy === 'title') {
        sortedBugs.sort((bug1, bug2) => sortDir * (bug1.title.localeCompare(bug2.title)))
    } else if (sortBy === 'severity') {
        sortedBugs.sort((bug1, bug2) => sortDir * (bug1.severity - bug2.severity))
    } else if (sortBy === 'createdAt') {
        sortedBugs.sort((bug1, bug2) => sortDir * (bug1.createdAt - bug2.createdAt))
    }

    return sortedBugs
}


function _getUniqueLabels(bugs) {
    if (!bugs || !bugs.length) return

    const uniqueLabels = []
    bugs.reduce((acc, bug) => {
        if (!bug.labels) return acc

        bug.labels.forEach(label => {
            if (!acc.includes(label)) acc.push(label)
        })
        return acc
    }, uniqueLabels)

    return uniqueLabels
}