const path = require('path')
const fs = require('fs')
const FormData = require('form-data')

const { buildApp, fastify } = require('../src/app')
const { PORT } = require('../src/utils/constants.js')

beforeAll(async () => {
    const testApp = await buildApp()
    try {
        await testApp.listen({ port: PORT })
        // console.log(`Server running on http://localhost:${PORT}`)
    } catch (err) {
        fastify.log.error(err)
    }
})
afterAll(async () => {
    fastify.close()
})

describe('CSV Upload Integration Tests', () => {
    const uploadUrl = '/upload-movies'
    const validCsvPath = path.join(__dirname, 'valid_values.csv')
    const invalidCsvPath = path.join(__dirname, 'invalid_values.csv')

    const createMultipartBody = (filePath) => {
        const form = new FormData()
        form.append('file', fs.createReadStream(filePath))
        return form
    }

    // TEST OK
    test('Should successfully process a valid CSV file', async () => {
        const form = createMultipartBody(validCsvPath)
        const response = await fastify.inject({
            method: 'POST',
            url: uploadUrl,
            headers: form.getHeaders(),
            payload: form
        })

        try {
            expect(response.statusCode).toBe(200)
            const jsonResponse = JSON.parse(response.body)
            expect(jsonResponse).toHaveProperty('message', 'The csv was processed successfully') // this test is optional
        }
        catch {
            expect(response.statusCode).toBe(302)
        }
    })

    // TEST OK
    test('Should return an error for an invalid CSV file', async () => {
        const form = createMultipartBody(invalidCsvPath)
        const response = await fastify.inject({
            method: 'POST',
            url: uploadUrl,
            headers: form.getHeaders(),
            payload: form
        })
        expect(response.statusCode).toBe(500)
    })

    // TEST OK
    test('Should return an error 406 if no file and no form-data header is provided', async () => {
        const response = await fastify.inject({
            method: 'POST',
            url: uploadUrl,
        })
        expect(response.statusCode).toBe(406)
    })

    // TEST OK
    test('Should return an error if no file is provided', async () => {
        const response = await fastify.inject({
            method: 'POST',
            url: uploadUrl,
            headers: { "Content-Type": 'multipart/form-data;boundary="boundary"' },
        })
        expect(response.statusCode).toBe(400)        
        const jsonResponse = JSON.parse(response.body)
        expect(jsonResponse).toHaveProperty('message', 'No file was uploaded.')
    })
})
