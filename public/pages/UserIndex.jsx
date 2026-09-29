const { useState, useEffect } = React

import { userService } from "../services/user.service.js"
import { authService } from '../services/auth.service.js'
import { showErrorMsg,showSuccessMsg } from "../services/event-bus.service.js"

import { UserList } from '../cmps/UserList.jsx'


export function UserIndex() {
    const [users, setUsers] = useState(null)

    console.log('users', users)
    const getLoggedinUser = authService.getLoggedinUser()

    if (!getLoggedinUser.isAdmin) {
        return <div>You are not an admin...</div>
    }

    function onRemoveUser(userId) {
        userService.remove(userId)
            .then(() => {
                const usersToUpdate = users.filter(user => user._id !== userId)
                setUsers(usersToUpdate)
                showSuccessMsg('User removed')
            })
            .catch((err) => showErrorMsg(`Cannot remove user`, err))
    }

    useEffect(loadUsers, [])

    function loadUsers() {
        userService.query()
            .then(setUsers)
            .catch(err => showErrorMsg(`Couldn't load bugs - ${err}`))
    }

    return <section className="user-index main-content">

        <header>
            <h2>User List</h2>
        </header>

        <UserList
            users={users}
            onRemoveUser={onRemoveUser} />
    </section>
}