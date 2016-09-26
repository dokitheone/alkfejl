const express = require('express');
const nunjucks = require('nunjucks');

const app = express();

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

// Middlewares

app.use(express.static('public'));

app.use(function (req, res, next) {
    console.log(req.method, req.url);
    //req.alma = 'piros';
    next();
});

app.get('/', function (req, res) {
    res.render('hello.njk', {
        name: 'Viktor'
    });
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('Server is running!');
});