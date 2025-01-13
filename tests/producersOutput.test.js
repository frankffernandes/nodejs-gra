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

describe('Producers output Integration Tests', () => {
    test('Should successfully return producers on json format', async () => {
        const response = await fastify.inject({
            method: 'GET',
            url: '/producers',
        })

        const body = response.body

        expect(response.statusCode).toBe(200)
        const jsonResponse = JSON.parse(response.body)
        console.log("Producers json response:", jsonResponse)

        expect(jsonResponse).toHaveProperty('min')
        expect(jsonResponse).toHaveProperty('max')

        // 'min' key validation
        expect(Array.isArray(jsonResponse.min)).toBe(true)
        // expect(jsonResponse.min.length).toBeGreaterThanOrEqual(1)
        if (jsonResponse.min.length > 0) {
            const minValues = jsonResponse.min[0]
            expect(minValues).toHaveProperty('producer')
            expect(typeof minValues.producer).toBe('string')
            expect(minValues).toHaveProperty('interval')
            expect(typeof minValues.interval).toBe('number')
            expect(minValues).toHaveProperty('previousWin')
            expect(typeof minValues.previousWin).toBe('number')
            expect(minValues).toHaveProperty('followingWin')
            expect(typeof minValues.followingWin).toBe('number')
        }

        // 'max' key validation
        expect(Array.isArray(jsonResponse.max)).toBe(true)
        // expect(jsonResponse.max.length).toBeGreaterThanOrEqual(1)
        if (jsonResponse.max.length > 0) {
            const maxItem = jsonResponse.max[0]
            expect(maxItem).toHaveProperty('producer')
            expect(typeof maxItem.producer).toBe('string')
            expect(maxItem).toHaveProperty('interval')
            expect(typeof maxItem.interval).toBe('number')
            expect(maxItem).toHaveProperty('previousWin')
            expect(typeof maxItem.previousWin).toBe('number')
            expect(maxItem).toHaveProperty('followingWin')
            expect(typeof maxItem.followingWin).toBe('number')
        }
    })
})