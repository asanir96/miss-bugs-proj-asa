const { Link, NavLink, useParams, useNavigate } = ReactRouterDOM

import { authService } from "../services/auth.service.js"
import { showErrorMsg, showUserMsg } from "../services/event-bus.service.js"

export function AppHeader({ loggedinUser, setLoggedinUser }) {
    const navigate = useNavigate()

    function onLogout() {
        authService.logout()
            .then(() => {
                setLoggedinUser(null)
                navigate('/bug')
                showUserMsg('Logged out')
            })
            .catch(err => {
                console.log(err)
                showErrorMsg(`Couldn't logout`)
            })
    }

    return <header className="app-header main-content single-row">
        <h1>Miss Bug</h1>
        <nav>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/bug">Bugs</NavLink>
            <NavLink to="/about">About</NavLink>
            {
                !loggedinUser ?
                    <NavLink to="/auth" >Login</NavLink> :
                    <div className="user">
                        <button onClick={onLogout}>Logout</button>
                        <Link to={`/user/${loggedinUser._id}`}>{loggedinUser.fullname}</Link>
                    </div>
            }
        </nav>

    </header>
}