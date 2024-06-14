const express = require("express");
const fs = require("fs");
const cors = require('cors');

const app = express();
const port = 1972;

app.use(cors());

app.get('/getData', (req, res) => {
    fs.readFile('./jsons/data.json', (err, data) => {
        if (err) throw err;

        const jobData = {data: JSON.parse(data.toString())};

        res.send(JSON.stringify(jobData));
    });
});

app.listen(port, () => {
    console.log(`API server is running in: http://localhost:${ port }`)
})