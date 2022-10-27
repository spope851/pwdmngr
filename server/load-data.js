const fs = require('fs')
const Pool = require('pg').Pool;
const csv = require('csv-parser');

const pool = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
  })

fs.createReadStream('pwds.csv')
  .pipe(csv())
  .on('data', async ({ name, url, username, password }) => {
    pool.query(`
      CREATE TABLE IF NOT EXISTS unreal_data (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        url VARCHAR(255) NOT NULL,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL 
      );
      INSERT INTO pwds(name, url, username, password) VALUES($1, $2, $3, $4);
    `, [name, url, username, password]) 
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
  });
