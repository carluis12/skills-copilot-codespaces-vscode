// Create web server

// Import express module
const express = require('express');

// Import path module
const path = require('path');

// Import body-parser module
const bodyParser = require('body-parser');

// Import mongoose module
const mongoose = require('mongoose');

// Import express-session module
const session = require('express-session');

// Import express-validator module
const expressValidator = require('express-validator');

// Import flash module
const flash = require('connect-flash');

// Import config database
const config = require('./config/database');

// Connect to database
mongoose.connect(config.database);

// Init app
const app = express();

// Import models
let Article = require('./models/article');

// Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Parse application/json
app.use(bodyParser.json());

// Set public folder
app.use(express.static(path.join(__dirname, 'public')));

// Express session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

// Express messages middleware
app.use(require('connect-flash')());
app.use(function(req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
});

// Express validator middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        let namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;
        
        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

// Home route
app.get('/', function(req, res) {
    Article.find({}, function(err, articles) {
        if(err) {
            console.log(err);
        } else {
            res.render('index', {
                title: 'Articles',
                articles: articles
            });
        }
    });
});

// Route files
let articles = require('./routes/articles');
let users = require('./routes/users');
app.use('/articles', articles);
app.use('/users', users);
