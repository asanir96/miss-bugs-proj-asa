import express from 'express'
import cookieParser from 'cookie-parser'
import { bugService } from './bug-service.js'
import { userService } from './users.service.js'
import { authService } from './auth.service.js'

const app = express()
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

// app.get('/', (req, res) => res.send('Hello there'))

app.set('query parser', 'extended') // allow sending arrays and objects in query params

app.listen(3030, () => console.log('Server ready at port 3030'))

app.get('/api/bug', (req, res) => {
    const filterBy = {
        userId: req.query.userId || '',
        txt: req.query.txt || '',
        minSeverity: +req.query.minSeverity || 0,
        labels: req.query.labels || [],
        pageIdx: +req.query.pageIdx || 0,
        sortBy: req.query.sortBy || 'createdAt',
        sortDir: +req.query.sortDir || 1
    }

    bugService.query(filterBy)
        .then(bugsInfo => res.send(bugsInfo))
        .catch(err => res.status(400).send('Cannot get bugs'))
})

app.get('/api/bug/last-page-idx', (req, res) => {
    const filterBy = {
        txt: req.query.txt || '',
        minSeverity: +req.query.minSeverity || 0,
        labels: req.query.labels || [],
        pageIdx: +req.query.pageIdx || 0,
        sortBy: req.query.sortBy || 'createdAt',
        sortDir: +req.query.sortDir || 1
    }

    bugService.query(filterBy)
        .then(bugsInfo => res.send(bugsInfo))
})

app.put('/api/bug/:bugId', (req, res) => {
    const loggedinUser = authService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Not Authenticated')

    const { title, severity, description, labels, _id, creator } = req.body

    if (!_id || !title || !severity) return res.status(400).send('Missing required fields')

    const bug = {
        title,
        severity: +severity,
        description,
        labels: labels || [],
        _id,
    }

    if (creator) bug.creator = creator

    bugService.save(bug, loggedinUser)
        .then(savedBug => res.send(savedBug))
        .catch(err => res.status(400).send('Cannot save bugs'))
})

app.post('/api/bug/', (req, res) => {
    const loggedinUser = authService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Not Authenticated')

    const { title, severity, description, labels } = req.body

    if (!title || !severity) return res.status(400).send('Missing required fields')

    const bug = {
        title,
        severity: +severity || 1,
        description,
        labels: labels || [],
    }

    bugService.save(bug, loggedinUser)
        .then(savedBug => res.send(savedBug))
        .catch(err => res.status(400).send('Cannot create a bug'))
})

app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    const visitedBugs = req.cookies.visitedBugs || []

    // TODO: Change cookie so when limit is hit the user can still visit already visited bugs
    if (!visitedBugs.includes(bugId)) {
        if (visitedBugs.length >= 3) {
            return res.status(401).send('Wait for a bit')
        } else {
            visitedBugs.push(bugId)
        }
    }

    res.cookie('visitedBugs', visitedBugs, { maxAge: 7 * 1000 })

    bugService.get(bugId)
        .then(bug => res.send(bug))
        .catch(err => res.status(400).send('Cannot find bug'))
})

app.delete('/api/bug/:bugId/', (req, res) => {
    const loggedinUser = authService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Not Authenticated')

    const { bugId } = req.params

    bugService.remove(bugId, loggedinUser)
        .then(bug => res.send(bug))
        .catch(err => res.status(400).send(err))

})


// Auth 
app.post('/api/auth/signup', (req, res) => {
    const { username, password, fullname } = req.body
    const user = { username, password, fullname }

    userService.add(user)
        .then(user => {
            const loginToken = authService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(err => res.status(400).send('Username taken'))

})

app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body

    authService.checkLogin({ username, password })
        .then(user => {
            console.log('user', user)
            const loginToken = authService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(() => res.status(404).send('Cannot sign in'))
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('logged-out!')
})


// Users

app.get('/api/user', (req, res) => {
    userService.query()
        .then(users => res.send(users))
        .catch(err => res.status(400).send('Cannot get users'))
})

app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params

    userService.getById(userId)
        .then(user => res.send(user))
        .catch(err => res.status(400).send('Cannot find user'))
})