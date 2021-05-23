const express = require('express');
const path = require('path');
const morgan = require('morgan');

const app = express();
app.set('port', process.env.PORT || 3000);

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

console.log(path.join(__dirname, 'public'))

app.use((req, res, next) => {
    console.log('모든 요청에 대해 실행하는 미들웨어');
    req.user='BTS';
    next();
});

app.use((req, res, next) => {
    res.day = 'Easter';
    next();
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/nodejs', (req, res) => {
    res.sendFile(path.join(__dirname, './public/nodejs.html'))
})

app.get('/about', (req, res, next) => {
    console.log('about 1');
    if (req.headers.cookie) next();
    else throw new Error('Invalid Cookie');
}, (req, res) => {
    let obj = {product:'coke', price:'800'};
    res.send(obj);
});

app.get('/users/:userId', (req, res) => {
    res.send(`${req.user} send User ${req.params.userId} eggs at ${res.day}`);
});

app.get('/users/:userId/books/:bookId', (req, res) => {
    res.send(`User ${req.params.userId}, Book ${req.params.bookId}`);
});

app.get('*', (req, res) => {
    res.redirect('/');
});

app.use((err, req, res, next) => {
    res.status(401).send(err.message);
});

app.listen(app.get('port'), () => {
    console.log(`App liestening at http://localhost:${app.get('port')}`)
});