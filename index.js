const express = require('express');
const bodyparser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(morgan('tiny'));
app.use(bodyparser.json());
app.use(cors());

require('./routes/api.js')(app, express.Router());

const port = 3000;

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});