import knex from "knex";

export const database = knex({
    client: 'mysql',
    connection: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '123456789',
        database: 'fidaf'
    }
})