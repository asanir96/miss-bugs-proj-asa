const STORAGE_KEY_LOGGEDIN_USER = 'loggedInUser'

export const authService = {
    login,
    getLoggedinUser,
    logout,
    signup,
}

function login(credentials) {
    return axios.post('/api/auth/login', credentials)
        .then(res => res.data)
        .then(_setLoggedinUser)
}

function logout() {
    return axios.post('/api/auth/logout')
        .then(() => sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER))
}

function signup(user) {
    return axios.post('/api/auth/signup', user)
        .then(res => res.data)
        .then(_setLoggedinUser)
}

function getLoggedinUser() {
    const str = sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER)
    const user = JSON.parse(str)
    return user
}

function _setLoggedinUser(user) {
    const { _id, fullname,isAdmin } = user
    const userToSave = { _id, fullname,isAdmin }

    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(userToSave))
    return userToSave
}