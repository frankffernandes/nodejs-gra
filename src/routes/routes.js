
const HomeController = require('../controllers/home.controller.js')
const MovieController = require('../controllers/movie.controller.js')

async function routes(server, options) {
    const movieRepository = server.db.getRepository('Movie')
    const movieController = new MovieController(movieRepository)
    // console.log("movieController", movieController)

    // GET / - Get the initial form to upload movies from csv file
    server.get('/', HomeController.index)

    server.post('/movies', async (request, reply) => {
        const movie = await movieController.createMovie(request.body)
        return movie
    })

    // GET /movies - Get all movies from the model and return as a html table
    server.get('/movies', async (request, response) => { return movieController.listMovies(request, response) })

    // POST /upload-movies - Create new movies from the csv uploaded
    server.post('/upload-movies', async (request, response) => { return movieController.upload(request, response) })

    // GET /movies/:id - Get a single movie by ID
    server.get('/movies/:id', async (request, response) => { return movieController.find(request, response) })

    // PUT /movies/:id - Update a single movie by ID
    server.put('/movies/:id', async (request, response) => { return movieController.edit(request, response) })
    // server.put('/movies/:id', movieController.edit)

    // DELETE /movies/:id - Delete a movie by ID
    server.delete('/movies/:id', async (request, response) => { return movieController.delete(request, response) })
    // server.delete('/movies/:id', movieController.delete)

    // GET /producers - Get custom gap producers
    server.get('/producers', async (request, response) => { return movieController.producers(request, response) })
    // server.get('/producers', movieController.producers)
}

module.exports = routes