const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();
app.set('port', process.env.PORT || 3000);

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave:false,
    saveUninitialized:true,
    secret:process.env.COOKIE_SECRET,
    cookie: {
        httpOnly:true,
        secure:false,
        maxAge:6000000
    },
    name:'session-cookie'
}));

const users = {};

app.use((req, res, next) => {
    console.log(req.session);
    console.log(req.sessionID);
    req.session.views = (req.session.views || 0) + 1;
    next();
})

app.get('/', (req, res) => {
    console.log(req.signedCookies)
    if(req.signedCookies.admit)
        res.send('<h1>Login Success</h1>');
    else
        res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, './public/login.html'));
});

app.post('/admit', (req, res) => {
    const {login, password} = req.body;
    // console.log(req.body);
    // console.log(login, password);

    if (login == 'guest' && password == '7777') {
        res.cookie('admit', true, {
            maxAge: 600000,
            httpOnly: true,
            secure: false,
            path:'/',
            signed: true
        });
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});

app.get('/user', (req, res) => {
    res.sendFile(path.join(__dirname, './public/user.html'));
});

app.get('/users', (req, res) => {
    res.send(users);
})

app.post('/user', (req, res) => {
    const {name, memo} = req.body;
    const id = Date.now();
    users[id] = {name, memo};
    res.end();
});

app.put('/user/:id', (req, res) => {
    const {name, memo} = req.body;
    users[req.params.id] = {name, memo};
    res.end();
});

app.delete('/user/:id', (req, res) => {
    delete users[req.params.id];
    res.end();
});

app.use((err, req, res, next) => {
    res.status(401).send(err.message);
});

app.listen(app.get('port'), () => {
    console.log(`App liestening at http://localhost:${app.get('port')}`)
});