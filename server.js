const express = require('express')
const app = express()

app.use(express.static("."));

const port = process.env.PORT || 8800;

app.listen(port)

console.log(`dev server listend at ${port}`);