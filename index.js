const express = require('express');
const bodyparser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

if (process.env.NODE_ENV === 'production'){
    app.use(morgan('tiny'));
} else if (process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

app.use(bodyparser.json());
app.use(cors());

const router = express.Router();

const v1 = require('./v1/api.js')(app, router);
const v2 = require('./v2/api.js')(app, router);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});