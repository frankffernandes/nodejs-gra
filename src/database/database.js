const { DataSource } = require('typeorm')
const Movie = require('../models/movie.model')

const AppDataSource = new DataSource({
    type: 'sqlite',
    database: ':memory:',
    synchronize: true,
    entities: [Movie]
})

module.exports = AppDataSource