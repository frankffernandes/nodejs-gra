const buildApp = require('./src/app')
const { PORT } = require('./src/utils/constants.js')

// const rootApp = null

async function start() {
// const start = async () => {
    const app = await buildApp()
    try {
        await app.listen({ port: PORT })
        console.log(`Server running on http://localhost:${PORT}`)
    } catch (err) {
        app.log.error(err)
        // process.exit(1)
    }
    return app
}
const rootApp = start()

module.exports = rootApp