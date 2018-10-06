const pg = require('pg');

const config = {
    user: 'postgres',
    database: 'Jump',
    password: '1234',
    port: 5432
}

const pool = new pg.Pool(config);

module.exports = pool;