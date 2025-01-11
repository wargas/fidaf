import knex from "knex";



export const database = knex({
    client: 'mysql2',
    connection: {
        host: process.env.MYSQL_HOST || 'localhost',
        port: parseInt(process.env.MYSQL_PORT || '3308'),
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '123456789',
        database: process.env.MYSQL_DATABASE || 'fidaf'
    }
})