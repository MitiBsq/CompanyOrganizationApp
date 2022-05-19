const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = process.env.SERVER_PORT;

app.use(cors());
app.use(express.json());

//The routes used for collecting data
app.use('/api', require('./api/person'));
app.use('/api', require('./api/group'));
app.use('/api', require('./api/users'));

app.listen(PORT, () => {
    console.log(`Server is up on Port ${PORT}`);
});