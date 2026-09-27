const { useState, useEffect, useRef } = React
const { useParams, useNavigate } = ReactRouterDOM

import { showErrorMsg } from "../services/event-bus.service.js"
import { userService } from "../services/user.service.js"
import { bugService } from "../services/bug.service.js"
import { BugList } from '../cmps/BugList.jsx'

export function UserDetails() {
    const [user, setUser] = useState(null)
    const [userBugs, setUserBugs] = useState(null)

    const params = useParams()

    useEffect(() => {
        loadUser()
            .then(user => loadBugs({ userId: user._id }))
    }, [])

    function loadBugs(filterBy) {
        bugService.query(filterBy)
            .then(bugs => {
                setUserBugs(bugs)
            })
            .catch(err => showErrorMsg(`Couldn't load bugs - ${err}`))
    }

    function loadUser() {
        return userService.getById(params.userId)
            .then(user => {
                setUser(user)
                return user
            })
            .catch(err => showErrorMsg(err))
    }


    function onEditBug(bug) {
        const severity = +prompt('New severity?', bug.severity)
        if (!severity || severity === bug.severity) return

        const bugToSave = { ...bug, severity }

        bugService.save(bugToSave)
            .then(savedBug => {
                const bugsToUpdate = bugs.map(currBug =>
                    currBug._id === savedBug._id ? savedBug : currBug)

                setBugs(bugsToUpdate)
                showSuccessMsg('Bug updated')
            })
            .catch(err => showErrorMsg('Cannot update bug', err))
    }

    function onRemoveBug(bugId) {
        bugService.remove(bugId)
            .then(() => {
                const bugsToUpdate = userBugs.filter(bug => bug._id !== bugId)
                setUserBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch((err) => showErrorMsg(`Cannot remove bug`, err))
    }


    if (!user) return <div>Loading...</div>

    return <div>
        <h1>User {user.fullname}</h1>
        <pre>
            {JSON.stringify(user, null, 2)}
        </pre>

        {userBugs && userBugs.length &&
            <BugList
                bugs={userBugs}
                onRemoveBug={onRemoveBug}
                onEditBug={onEditBug} />
        }

    </div>
}