const { Link } = ReactRouterDOM

import { BugPreview } from './BugPreview.jsx'
import { authService } from '../services/auth.service.js'

export function BugList({ bugs, onRemoveBug, onEditBug }) {
    const user = authService.getLoggedinUser()

    function isAllowed(bug) {
        if (!user) return false
        if (bug.creator && bug.creator._id === user._id) return true

        return false
    }


    if (!bugs) return <div>Loading...</div>

    return <ul className="bug-list">
        {bugs.map(bug => (
            <li key={bug._id}>
                <BugPreview bug={bug} />
                <section className="actions">
                    <button><Link to={`/bug/${bug._id}`}>Details</Link></button>
                    {isAllowed(bug) && <button onClick={() => onEditBug(bug)}>Edit</button>}
                    {isAllowed(bug) && <button onClick={() => onRemoveBug(bug._id)}>x</button>}
                </section>
            </li>
        ))}
    </ul >
}
