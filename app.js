/**
 *  Application express
 *  avec middlewares
 */
const express = require('express');
const mongoose = require("mongoose");
// Add the mongoose-morgan package for logs into mongoDB
const mongooseMorgan = require("mongoose-morgan");
const cookieSession = require("cookie-session");
const helmet = require("helmet");
const cors = require("cors");
const xssClean = require("xss-clean");
const morgan = require('morgan');  // dev to check request in temrinal
//Data Sanitization against NoSQL Injection Attacks
const mongoSanitize = require('express-mongo-sanitize');
require("dotenv").config();

const sauceRoutes = require('./routes/sauce');
const userRoutes = require("./routes/user");

const path = require("path");

// const nocache = require("node-nocache");

const app = express();


mongoose.connect(process.env.DBLINK, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(err => console.log("Connexion à MongoDB échouée !", err));

// Add logs with mongoose-morgan
// Personalise logs => Only record requests having a value under 400
mongooseMorgan.token('body', (req, res) => JSON.stringify(req.body));
mongooseMorgan.token('req', (req, res) => JSON.stringify(req.headers.authorization));
app.use(
  mongooseMorgan({
    connectionString:process.env.DBLINK,
  }, {skip: function (req, res) { return res.statusCode < 400 }}, 'date:date status::status method::method url::url body::body remote-addr::remote-addr referrer::referrer'
  )
);

app.use(helmet());
/*const corsOptions = {
  origin: "127.0.0.1:8081"
};
// Then pass them to cors:
app.use(cors(corsOptions))*/
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
/*
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', corsOptions.origin)
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  next()
});
*/
/*app.use(
  cookieSession({
    name: "session",
    secret: "s3CuwsxR6T9",
    cookie: {
      secure: true,
      httpOnly: true,
      domain: "http://localhost:3000/",
    },
  })
);*/

// app.use(nocache());
//app.disable("x-powered-by"); Inutile avec helmet deja disabled
// To replace prohibited characters with _, use:
app.use(
  mongoSanitize({
    replaceWith: '_',
  })
);

app.use(express.json());

app.use(xssClean());
/*
let corsOptions = {
  origin: 'http://127.0.0.1:8081',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(express.static('public'));
app.get('/relogin.html', cors(corsOptions));
*/

app.use(morgan('tiny')); // console request

app.use("/images", express.static(path.join(__dirname, "images")));

// app.use(express.urlencoded({extended: true}));
// app.use(express.json());

app.use('/api/sauces', sauceRoutes);

app.use("/api/auth", userRoutes);

module.exports = app;
