const HomeController = require('../controllers/home.controller.js')
const MovieController = require('../controllers/movie.controller.js')
const Movie = require('../models/movie.model')

const AppDataSource = require('../database/database.js')

async function routes(fastify, options) {
    const movieRepository = AppDataSource.getRepository(Movie)
    const movieController = new MovieController(movieRepository)

    // GET / - Get the initial form to upload movies from csv file
    fastify.get('/', HomeController.index)


    // GET /movies - Get all movies from the model and return as a html table
    fastify.get('/movies', async (request, response) => { return movieController.listMovies(request, response) })

    // POST /upload-movies - Create new movies from the csv uploaded
    fastify.post('/upload-movies', async (request, response) => { return movieController.upload(request, response) })

    // GET /movies/:id - Get a single movie by ID
    fastify.get('/movies/:id', async (request, response) => { return movieController.find(request, response) })

    // PUT /movies/:id - Update a single movie by ID
    fastify.put('/movies/:id', async (request, response) => { return movieController.edit(request, response) })

    // DELETE /movies/:id - Delete a movie by ID
    fastify.delete('/movies/:id', async (request, response) => { return movieController.delete(request, response) })

    // GET /producers - Get custom gap producers
    fastify.get('/producers', async (request, response) => { return movieController.producers(request, response) })
}

module.exports = routes