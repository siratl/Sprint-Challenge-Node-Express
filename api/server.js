const express = require('express')

const actionsRouter = require('../data/actions/actionsRouter')

const helmet = require('helmet')

const projectsRouter = require('../data/projects/projectsRouter')

const server = express()

server.use(express.json())

server.use(helmet())

server.use('/api/actions', actionsRouter)
server.use('/api/projects', projectsRouter)

server.get('/', async (req, res) => {
    res.send(
        `<h1>Server Running...</h1> \n<p>Navigate to /api/actions </p>\n<p>Navigate to /api/projects </p>
    `,
    )
})

module.exports = server;