const STORAGE_KEY_LOGGEDIN_USER = 'loggedInUser'

export const authService = {
    login,
    getLoggedinUser,
    // signup, logout, getLoggedinUser
}

function login(credentials) {
    return axios.post('/api/auth/login', credentials)
        .then(res => res.data)
        .then(_setLoggedinUser)
}

function getLoggedinUser() {
    const str = sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER)
    const user = JSON.parse(str)
    return user
}

function _setLoggedinUser(user) {
    const { _id, fullname } = user
    const userToSave = { _id, fullname }

    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(userToSave))
    return userToSave
}