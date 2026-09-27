const { useState, useEffect } = React
const { useParams, useNavigate } = ReactRouterDOM

import { showErrorMsg } from "../services/event-bus.service.js"
import { userService } from "../services/user.service.js"
import { bugService } from "../services/bug.service.js"

export function UserDetails() {
    const [user, setUser] = useState(null)
    const [userBugs, setUserBugs] = useState(null)

    const params = useParams()

    useEffect(() => {
        loadUser()
            .then(user => loadBugs({ userId:user._id }))
    }, [])

    function loadBugs(filterBy) {
        bugService.query(filterBy)
            .then(bugs => {
                console.log('bugs',bugs)
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

    if (!user) return <div>Loading...</div>

    return <div>
        <h1>User {user.fullname}</h1>
        <pre>
            {JSON.stringify(user, null, 2)}
        </pre>

        {userBugs && userBugs.length && <pre>
            {JSON.stringify(userBugs, null, 2)}
        </pre>
        }

    </div>
}