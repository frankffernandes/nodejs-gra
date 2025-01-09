const { buildApp, app } = require('./src/app')
const { PORT } = require('./src/utils/constants.js')

const start = async () => {
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
start()