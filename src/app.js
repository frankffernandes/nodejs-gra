const { PORT, DEBUG } = require('./utils/constants.js')
const routes = require("./routes/routes.js")
const AppDataSource = require('./database/database.js')
const dbInitializers = require('./initializers/db.js')

const fastify = require('fastify')({ logger: DEBUG })
const fastifyMultipart = require('@fastify/multipart')

const buildApp = async () => {
    await AppDataSource.initialize()
    fastify.decorate('db', AppDataSource)
    fastify.register(fastifyMultipart)
    fastify.register(routes)

    await dbInitializers()

    return fastify
}
module.exports = { buildApp, fastify }