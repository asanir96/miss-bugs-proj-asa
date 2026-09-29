import fs from 'fs'
import { utilService } from './util.service.js'
import { bugService } from './bug-service.js'

const users = utilService.readJsonFile('data/user.json')

export const userService = {
    query,
    getById,
    getByUsername,
    remove,
    add,
}

function query() {
    const usersToReturn = users.map(user => ({ _id: user._id, fullname: user.fullname, username: user.username }))
    return Promise.resolve(usersToReturn)
}

function getById(userId) {
    var user = users.find(user => user._id === userId)
    if (!user) return Promise.reject('User not found')

    console.log('user', user)
    user = { ...user }
    delete user.password

    return Promise.resolve(user)
}

function getByUsername(username) {
    var user = users.find(user => user.username === username)
    return Promise.resolve(user)
}

function remove(userId, loggedInUser) {
    const userIdx = users.findIndex(user => user._id === userId)
    var removedUser = users.at(userIdx)

    return bugService.query({ userId: removedUser._id })
        .then(removedUserBugs => {
            if (removedUserBugs && removedUserBugs.length > 0) {
                return Promise.reject('This user still has bugs')
            }

            if (loggedInUser.isAdmin) {
                users.splice(userIdx, 1)

                return _saveUsersToFile()
                    .then(() => {
                        removedUser = { ...removedUser }
                        delete removedUser.password
                        return removedUser
                    })
            } else {
                return Promise.reject('You are not an admin')
            }
        })




}

function add(user) {
    return getByUsername(user.username)
        .then(existingUser => {
            if (existingUser) return Promise.reject('Username already exists')

            user._id = utilService.makeId()
            users.push(user)
            return _saveUsersToFile()
                .then(() => {
                    user = { ...user }
                    delete user.password
                    return user
                })
        })
}


function _saveUsersToFile() {
    return new Promise((resolve, reject) => {
        const usersStr = JSON.stringify(users, null, 2)
        fs.writeFile('data/user.json', usersStr, err => {
            if (err) {
                return console.log(err)
            }
            resolve()
        })
    })
}