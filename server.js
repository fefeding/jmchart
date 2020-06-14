const express = require('express')
const app = express()

app.use(express.static("."));

const port = process.env.HTTP_PORT || 8800;
const ip = process.env.HTTP_IP || '127.0.0.1';

app.listen(port, ip);

console.log(`dev server listend at ${port}`);