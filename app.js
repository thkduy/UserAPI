const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

app.use('*', cors());

//Import Routes
const authRouth = require('./routes/auth');

dotenv.config();

//connect to DB
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true }, () => 
    console.log('DB connect successfully')
);


app.use(express.json());

//Route Middlewares
app.use('/api/user', authRouth);

const PORT = process.env.PORT || '3001';

app.listen(PORT, () => {
    console.log(`Server up and running : http://localhost:${PORT}/`);
});
