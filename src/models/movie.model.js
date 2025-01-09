const { EntitySchema } = require('typeorm')

module.exports = new EntitySchema({
    name: 'Movie',
    tableName: 'movies',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true
        },
        year: {
            type: 'int'
        },
        title: {
            type: 'varchar'
        },
        studios: {
            type: 'varchar'
        },
        producers: {
            type: 'varchar'
        },
        winner: {
            type: 'varchar',
            default: "no"
        }
    }
})
