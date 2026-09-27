const { useState } = React
const { useNavigate } = ReactRouter

import { authService } from "../services/auth.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"


export function LoginSignup({ setLoggedInUser }) {
    const [isSignup, setIsSignup] = useState(false)

    const navigate = useNavigate()

    function handleSubmit(ev) {
        ev.preventDefault()
        const formData = new FormData(ev.target)

        const username = formData.get('username')
        const password = formData.get('password')
        const fullname = formData.get('full-name')

        if (isSignup) onSignup({ username, password, fullname })
        else onLogin({ username, password })
    }

    function onSignup(user) {
        authService.signup(user)
            .then(user => {
                setLoggedInUser(user)
                showSuccessMsg('Signed up and logged in!')
                navigate('/bug')
            })
            .catch(() => showErrorMsg('Could not sign up'))
    }

    function onLogin(credentials) {
        authService.login(credentials)
            .then(user => {
                setLoggedInUser(user)
                showSuccessMsg('Logged in!')
                navigate('/bug')
            })
            .catch(() => showErrorMsg('Could not log in'))
    }


    return <div className="login-page">

        <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username: </label>
            <input type="text" name="username" />

            <label htmlFor="password">Password: </label>
            <input type="password" name="password" />

            {isSignup && <label htmlFor="password">Full Name: </label>}
            {isSignup && <input type="text" name="full-name" />}

            <button>{isSignup ? 'Signup' : 'Login'}</button>
        </form>

        <div className="btns">
            <button onClick={() => setIsSignup(!isSignup)}>
                {isSignup ?
                    'Already a member? Login' :
                    'New user? Signup here'
                }
            </button>
        </div>
    </div>
}