// play this: https://www.youtube.com/watch?v=d-diB65scQU

// code away!
const server = require('./api/server')

const port = process.env.PORT || 4000

server.listen(port, () => {
    console.log(`\n*** Server running on Port: ${port} ***\n`)
})