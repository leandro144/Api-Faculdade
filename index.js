require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');

const app = express();
connectDB();

app.use(bodyParser.json());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/diploma', require('./routes/diploma'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
