const express = require('express')
const bodyParser = require("body-parser");
const cors = require("cors");
const keys = require("./keys");
const fs = require('fs')

const app = express()
app.use(cors());
app.use(bodyParser.json());

const Pool = require('pg').Pool;
const csv = require('csv-parser');

const pool = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort
});

app.get('/getall', async (req, res) => {
    console.log('GET', req.query)
    await pool.query(`SELECT * FROM pwds ${req.query.search ? `WHERE name LIKE '%${req.query.search}%'` : ';'}`).then(
      data => res.send(data.rows),
      () => res.send([])
    )
})

app.post('/upload', async (req, res) => {
  console.log('POST upload', req.query);
  const fileName = req.query.fileName;

  req.on('data', chunk => {
      fs.appendFileSync(fileName, chunk);
  })

  return res.end(`${fileName} was uploaded.`)
})

app.post('/insert', async (req, res) => {
  console.log('POST insert', req.query);
  const fileName = req.query.fileName;

  fs.createReadStream(fileName)
    .pipe(csv())
    .on('data', async ({ name, url, username, password }) => {
      const insertData = async () => 
        await pool.query(`INSERT INTO pwds(name, url, username, password) VALUES($1, $2, $3, $4);`,
          [name, url, username, password])

      const removeFile = async () => {
        fs.unlinkSync(fileName)
        console.log(`${fileName} was removed`);
      }

      await insertData().then(
        removeFile,
        async () => {
          await pool.query(`
            CREATE TABLE IF NOT EXISTS pwds (
              id SERIAL PRIMARY KEY,
              name VARCHAR(255) NOT NULL,
              url VARCHAR(512) NOT NULL,
              username VARCHAR(255) NOT NULL,
              password VARCHAR(255) NOT NULL 
            );`
          ).then(insertData).finally(removeFile)
        }
      )
      
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
    });

  return res.end('Database update complete')
})

app.listen(5000, err => {
  console.log("Listening");
});
