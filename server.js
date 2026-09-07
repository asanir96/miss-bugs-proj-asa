import express from 'express'
import { bugService } from './bug-service.js'

const app = express()
app.use(express.static('public'))

// app.get('/', (req, res) => res.send('Hello there'))

app.listen(3030, () => console.log('Server ready at port 3030'))

app.get('/api/bug', (req, res) => {
    bugService.query()
        .then(bugs => res.send(bugs))
})

app.get('/api/bug/save', (req, res) => {
    const { title, severity, description, _id } = req.query

    bugService.save({ title, severity,description, _id })
        .then(savedBug => res.send(savedBug))
})

app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params

    bugService.get(bugId)
        .then(bug => res.send(bug))
})

app.get('/api/bug/:bugId/remove', (req, res) => {
    const { bugId } = req.params

    bugService.remove(bugId)
        .then(bug => res.send(bug))
})