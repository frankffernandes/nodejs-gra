const fastify = require('fastify')
const fastifyMultipart = require('@fastify/multipart')

const { PORT, DEBUG } = require('./utils/constants.js')
const routes = require("./routes/routes.js")
const AppDataSource = require('./database/database.js')

const app = fastify({ logger: DEBUG })
const buildApp = async () => {
    await AppDataSource.initialize()
    app.decorate('db', AppDataSource)
    app.register(fastifyMultipart)
    app.register(routes)
    return app
}

module.exports = { buildApp, app }