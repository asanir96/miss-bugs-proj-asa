const { Link, NavLink, useNavigate } = ReactRouterDOM

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
                        <Link to={`/user/${loggedinUser._id}`}>
                            <div className="user-profile-btn">
                                <i className="user-profile-icon fa-solid fa-circle-user"></i>
                                {loggedinUser.fullname}

                            </div>
                        </Link>
                        <button className="logout-btn" onClick={onLogout}>Logout</button>
                    </div>
            }
        </nav>

    </header>
}