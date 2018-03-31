const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const normalizePort = require('normalize-port');

const config = require('./config');

const app = express();

// this should be moved to environment
const dbUser = "justdguy";
const dbPassword = "Welcome3Infodat";

// Only include useMongoClient only if your mongoose version is < 5.0.0
mongoose.connect(config.database, {
  useMongoClient: true,
  auth: {
    user: dbUser,
    password: dbPassword
  }
}, err => {
  if (err) {
    console.log(err);
  } else {
    console.log('Connected to the database');
  }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cors());

// set express to serve all files from "client" folder
app.use( express.static( __dirname + '/client' ));
app.get( '/', function( req, res ) {
  res.sendFile( path.join( __dirname, 'client', 'index.html' ));
});

const userRoutes = require('./routes/account');
const mainRoutes = require('./routes/main');
const postRoutes = require('./routes/postidea');

app.use('/api', mainRoutes);
app.use('/api/accounts', userRoutes);
app.use('/api/postidea', postRoutes);
 
const port = normalizePort(process.env.PORT || config.port);

app.listen(port, err => {
  console.log('Magic happens on port awesome ' + config.port);
});
