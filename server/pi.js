const express = require('express')
const app = express()
const fs = require('fs')
const Pool = require('pg').Pool;
const csv = require('csv-parser');

const pool = new Pool({
    user: 'spenpo',
    host: 'localhost',
    database:  'unreal_db',
    password: 'Livew3ll',
    port:5432,
  })

app.get('/getall', async (req, res) => {
    console.log('GET ...doing some work...  ', req.query)
    const data = await pool.query(`SELECT * FROM unreal_data ${req.query.search && `WHERE data LIKE '%${req.query.search}%'`}`)
    res.status(200).send(data.rows)
})

app.listen(port, () => console.log(`Listening on port ${port}`))