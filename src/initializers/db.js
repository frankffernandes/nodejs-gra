const path = require('path')
const fs = require('fs')

const { INIT_DB_FILE } = require('../utils/constants.js')
const { AppDataSource } = require('../database/database.js')

const Movie = require('../models/movie.model')
const movieValidation = require('../utils/movie.validation.js')

async function initDatabase() {
    // console.log("initializing database")

    const movieRepo = AppDataSource.getRepository(Movie)

    let initFilePath = path.join(__dirname, INIT_DB_FILE)
    // console.log("initFilePath:", initFilePath)
    
    if (fs.existsSync(initFilePath)) {
        try {
            const result = await movieValidation.validateCsv(initFilePath, false)
            rows = result.rows
        } catch (error) {
            console.error("Error processing csv", error)
        }
        
        rows.forEach(row => {
            const movie = movieRepo.create(row)
            movieRepo.save(movie)
        })
    } else {
        console.warn("file doesn't exists")
    }
}


module.exports = initDatabase
