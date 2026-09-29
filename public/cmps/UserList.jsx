const { Link } = ReactRouterDOM

import { UserPreview } from './UserPreview.jsx'
import { authService } from '../services/auth.service.js'

export function UserList({users, onRemoveUser}) {
    const loggedInUser = authService.getLoggedinUser()

    function isAllowed(user) {
        if (!loggedInUser) return false

        if (loggedInUser.isAdmin && loggedInUser._id !== user._id) return true

        return false
    }


    if (!users) return <div>Loading...</div>

    return <ul className="user-list">
        {users.map(user => (
            <li key={user._id}>
                <UserPreview user={user} />
                <section className="actions">
                    <button><Link to={`/user/${user._id}`}>Details</Link></button>
                    {isAllowed(user) && <button onClick={() => onRemoveUser(user._id)}>x</button>}
                </section>
            </li>
        ))}
    </ul >
}
