const { Pool } = require('pg');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;
app.use(cors());
let Isconnect = false;
// PostgreSQL connection configuration
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL ,
  })
  pool.connect((err)=>{
    if(err){
        console.log("Connection error");
        
    }else{
        Isconnect = true;
        console.log("connected")
    }
})
app.use(express.json());

// Define endpoint to handle POST request to insert data
app.post('/insert', (req, res) => {
    console.log("req.body",req.body)
    let body = req.body;
    console.log("body", body)
    let width = body.width;
    let height = body.height;
    let depth = body.depth
    if(Isconnect){
        console.log("Add data in db")
            let params={
                width : width,
                height : height,
                depth: depth
            }
            addToDatabase(params)
    }else{
        console.log("Connection error, could not do data entry");
    }
});

function addToDatabase(params) {
    console.log("params - ", params)
    width = params.width;
    height = params.height;
    depth = params.depth;
    pool.query('INSERT INTO walldata(width, height, depth) VALUES ($1, $2, $3)', [width, height, depth], (err, result) => {
        if (err) {
            console.error('Error inserting data into database:', err);
            return;
        }
        console.log('Data inserted into database successfully');
    });
}

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
