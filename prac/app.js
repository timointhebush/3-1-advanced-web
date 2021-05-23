const express = require('express');

const app = express();
app.set('port', process.env.PORT || 3000);

app.use((req, res, next) => {
    req.user = 'BTS';
    next();
})

app.use((req, res, next) => {
    res.day = 'Easter';
    next();
})

app.get('/', (req, res) => {
    console.log('hello');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    console.log('heldddddlo');
    res.status(500).send('Somthing');
});

app.listen(app.get('port'), () => {
    console.log(`App liestening at http://localhost:${app.get('port')}`)
});