const fs = require('fs')
const path = require('path')

const movieValidation = require('../utils/movie.validation.js')
const Movie = require('../models/movie.model')

class MovieController {
    constructor(repo) {
        this.repository = repo
    }
    
    async getAllItems() {
        return this.repository.find({
            order: {
                year: 'ASC'
            }
        })
    }

    async getAllWinningMovies() {
        return await this.repository.find({
            where: {
                winner: "yes"
            },
            order: {
                year: 'ASC'
            }
        })
    }

    async listMovies(request, response) {
        const items = await this.getAllItems()

        let htmlString = `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Lista de filmes</title>
    </head>
    <body>
        <h1>Lista de filmes</h1>`
    if (items.length == 0) {
        htmlString += `<p>No movies to show</p>`
    } else {
        htmlString += `<table border="1">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Year</th>
                    <th>Title</th>
                    <th>Studios</th>
                    <th>Producers</th>
                    <th>Winner</th>
                </tr>
            </thead>
            <tbody>`

        items.forEach(item => {
            htmlString += `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.year}</td>
                    <td>${item.title}</td>
                    <td>${item.studios}</td>
                    <td>${item.producers}</td>
                    <td>${item.winner || 'no'}</td>
                </tr>`
        })
        htmlString += `
                </tbody>
            </table>`
    }
    htmlString += `
    </body>
</html`
        response.type('text/html').send(htmlString)
    }
    
    async upload(request, response) {
        const parts = request.parts()
        let rows = []
        let tempFilePath

        for await (const part of parts) {
            if (part.file) {
                tempFilePath = path.join(__dirname, 'upload.csv')
                const writeStream = fs.createWriteStream(tempFilePath)
                await part.file.pipe(writeStream)
            }
        }
        // console.log("tempFilePath:", tempFilePath)

        if ((tempFilePath) && (fs.existsSync(tempFilePath))) {
            try {
                const result = await movieValidation.validateCsv(tempFilePath)
                rows = result.rows
            } catch (error) {
                // console.error("Error processing csv", error)
                response.status(500).send({ message: 'Error while processing the csv file.' })
                return
            }
            
            rows.forEach(row => {
                const movie = this.repository.create(row)
                this.repository.save(movie)
            })
            response.status(200).send({ message: 'The csv was processed successfully' })
        } else {
            // console.warn("file doesn't exists")
            response.status(400).send({ message: 'No file was uploaded.' })
        }
    }

    async find(request, response) {
        const itemId = request.params.id
        const movie = await this.repository.findOne({
            where: {
                id: itemId
            },
        })
        if (movie) {
            return response.status(200).send({ movie: movie })
        }
        return response.status(404).send({ message: "Movie not found." })
    }

    async edit(request, response) {
        const itemId = request.params.id
        const { year, title, studios, producers, winner } = request.body
        const result = await this.repository.update({ id: itemId }, {
            year,
            title,
            studios,
            producers,
            winner
        })
        // console.log("editing movie:", result)
        if (result.affected != 0) {
            return response.status(204).send()
        }
        return response.status(404).send({ message: "Movie not found." })
    }

    async delete(request, response) {
        const itemId = request.params.id
        const result = await this.repository.delete({ id: itemId })
        // console.log("deleting movie:", result)
        if (result.affected != 0) {
            return response.status(204).send()
        }
        return response.status(404).send({ message: "Movie not found." })
    }

    // producers
    async getProducersWinningYears() {
        const items = await this.getAllWinningMovies()
        const producerYears = {}
    
        items.forEach(movie => {
            let producers = movie.producers.split(',')
            producers = producers.flatMap(part => part.split('and'))
            producers = producers.map(name => name.trim())
            producers.forEach(producer => {
                if (!producerYears[producer]) {
                    producerYears[producer] = []
                }
                producerYears[producer].push(parseInt(movie.year, 10))
            })
        })
        return producerYears
    }
    async getProducersWinningGap() {
        const producerYears = await this.getProducersWinningYears()
        // console.log("producerYears:", producerYears)
    
        let smallestGapProducer = null
        let smallestGap = Infinity
        let smallestGapYears = null

        let largestGapProducer = null
        let largestGap = -Infinity
        let largestGapYears = null
    
        for (const producer in producerYears) {
            const years = producerYears[producer].sort((a, b) => a - b)
            if (years.length > 1) {
                // console.log("years:", years, producer)
                for (let i = 1; i < years.length; i++) {
                    const minGap = years[i] - years[i - 1]

                    // for the min gap
                    if (minGap < smallestGap) {
                        smallestGap = minGap
                        smallestGapProducer = producer
                        smallestGapYears = years
                    }

                    // for the max gap
                    const maxGap = years[years.length - 1] - years[0]
                    if (maxGap > largestGap) {
                        largestGap = maxGap
                        largestGapProducer = producer
                        largestGapYears = years
                    }
                }
            }
        }

        return {
            min: (smallestGapProducer && smallestGap > 0) ? [{ producer: smallestGapProducer, interval: smallestGap, previousWin: smallestGapYears[0], followingWin: smallestGapYears[1] }] : [],
            max: (largestGapProducer && largestGap > 0) ? [{ producer: largestGapProducer, interval: largestGap, previousWin: largestGapYears[0], followingWin: largestGapYears[1] }] : [],
        }
    }
    async producers(request, response) {
        const items = await this.getProducersWinningGap()
        response.status(200).send(items)
    }
}

module.exports = MovieController