const fastify = require('fastify')
const fastifyMultipart = require('@fastify/multipart')

const { PORT, DEBUG } = require('./utils/constants.js')
const routes = require("./routes/routes.js")
const AppDataSource = require('./database/database.js')

// const app = fastify({ logger: DEBUG })
// app.register(fastifyMultipart)
// app.register(routes)
// app.listen({ port: PORT }, (error) => {
//   if (error) {
//     console.error('Error starting server:', error)
//     // process.exit(1)
//   }
//   console.log(`Server running on http://localhost:${PORT}`)
// })

// module.exports = app


// const buildApp = async () => {
//     console.log("ccc")
//     // await AppDataSource.initialize()
//     const app = fastify({ logger: DEBUG })
//     app.decorate('db', AppDataSource)
//     app.register(fastifyMultipart)
//     app.register(routes)
//     console.log("aaa")
//     return app
// }
// const start = async () => {
//     const app = await buildApp()
//     console.log("bbb")
//     try {
//         await app.listen({ port: PORT })
//         console.log(`Server running on http://localhost:${PORT}`)
//     } catch (err) {
//         console.error('Error starting server:', error)
//         // process.exit(1)
//     }
// }

// // module.exports = buildApp



const app = fastify({ logger: DEBUG })
const buildApp = async () => {
    await AppDataSource.initialize()
    app.decorate('db', AppDataSource)
    app.register(fastifyMultipart)
    app.register(routes)
    return app
}
module.exports = buildApp