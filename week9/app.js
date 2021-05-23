const express = require('express');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const nunjucks = require('nunjucks');
const multer = require('multer');

const app = express();
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'html');

nunjucks.configure('views', {
    express: app,
    autoscape: true,
});

app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));

try {
    fs.readdirSync('uploads');
} catch(error) {
    console.error('uploads폴더가 없어 uploads폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function(req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10*1024*1024
    }
});

app.get('/upload', (req, res) => {
    res.render('multipart', {
        title: 'File Upload'
    });
});

app.post('/upload', upload.single('image'), (req, res) => {
    console.log(req.file, req.body);
    res.send('업로드되었습니다!');
});

app.use((err, req, res, next) => {
    res.status(401).send(err.message);
});

app.listen(app.get('port'), () => {
    console.log(`http://localhost:${app.get('port')}에서 서버 작동 중`);
})