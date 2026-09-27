const { useState } = React
const { useNavigate } = ReactRouter

import { authService } from "../services/auth.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"


export function LoginSignup() {
    const navigate = useNavigate()

    function onLogin(ev) {
        ev.preventDefault()

        const formData = new FormData(ev.target)

        const username = formData.get('username')
        const password = formData.get('password')

        authService.login({ username, password })
            .then(user => {
                console.log(user)
                showSuccessMsg('Logged in!')
                navigate('/bug')
            })
            .catch(() => showErrorMsg('Could not log in'))
    }


    return <form onSubmit={onLogin}>
        <label htmlFor="username">Username: </label>
        <input type="text" name="username" />

        <label htmlFor="password">Password: </label>
        <input type="password" name="password" />

        <input type="submit" />
    </form>
}