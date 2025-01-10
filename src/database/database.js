const fp = require('fastify-plugin')
const { DataSource } = require('typeorm')
const Movie = require('../models/movie.model')

const AppDataSource = new DataSource({
    type: 'sqlite',
    database: ':memory:',
    synchronize: true,
    entities: [Movie]
})

async function TypeormPlugin(fastify) {
    try {
        await AppDataSource.initialize()
        fastify.decorate('db', AppDataSource)

        fastify.decorateRequest('getRepo', function (entity) {
            return AppDataSource.getRepository(entity)
        })

        fastify.log.info('TypeORM connected successfully')
    } catch (error) {
        fastify.log.error('TypeORM connection failed:', error)
        throw error
    }
}

const typeormPlugin = fp(TypeormPlugin)
module.exports = { 
    AppDataSource,
    typeormPlugin
}