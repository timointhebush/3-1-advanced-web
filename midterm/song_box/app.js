const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const nunjucks = require('nunjucks');

const app = express();
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'html');

nunjucks.configure('views', {
    autoescape: true,
    express: app,
});

// 미들웨어 사용
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));


// 데이터베이스 대신, 사용자와 노래를 저장하는 변수
const playlist_data = {
    timo: {
        key: {
            artist:'빅뱅',
            title:'LOSER',
        },
        key2: {
            artist:'아이유',
            title:'라일락',
        }
    }
};
const users_data = {
    timo : {
        email:'junzzang97@naver.com',
        password:'1234'
    }
}

// 메인화면, 로그인이되어있다면 플레이리스트 화면으로 넘어간다.
app.get('/', (req, res) => {
    if(req.signedCookies.admit) {
        console.log(req.signedCookies.admit);
        res.redirect('/playlist');
    } else {
        console.log('home_login');
        res.render('home_login');
    }
});

// 회원가입을 위한 코드.
// 만약 두번 입력한 패스워드가 다르다면, 오류메세지와 함께 회원가입창이 다시 뜸
app.get('/signup', (req, res) => {
    res.render('signup', {password:'normal'});
});
app.post('/signup', (req, res) => {
    const {email, username, password, repeat_password} = req.body;
    if (password != repeat_password) {
        res.render('signup', {password:'wrong'});
    } else {
        users_data[username] = {email, password};
        playlist_data[username] = {};
        console.log(users_data);
        res.redirect('/');
    }
});

//로그인을 위한 코드.
//로그인에 성공하면, 사용자 이름으로 쿠키를 생성.
app.post('/login', (req, res) => {
    const {email, password} = req.body;
    console.log(email);
    const users = Object.keys(users_data);
    for (let i=0; i<users.length; i++) {
        let user = users[i];
        if (users_data[user].email == email && users_data[user].password == password) {
            res.cookie('admit', users[i], {
                maxAge:360000,
                httpOnly:true,
                path:'/',
                signed:true,
            });
            res.redirect('/');
        }
    };
});

//로그아웃을 위한 코드
// 로그아웃 버튼을 누르게되면, 쿠키를 삭제한다.
app.get('/logout', (req, res) => {
    res.clearCookie('admit', req.signedCookies.admit, {
        maxAge:360000,
        httpOnly:true,
        path:'/',
        signed:true,
    });
    res.redirect('/');
});

// 프론트엔드에서 플레이리스트 데이터를 받아오기 위한 코드.
app.get('/playlistData', (req, res) => {
    res.send(playlist_data[req.signedCookies.admit]);
})

// 사용자가 추가해놓은 노래들을 볼 수 있는 플레이리스트 화면을 위한 코드.
app.get('/playlist', (req, res) => {
    res.render('page_playlist', {status: 'playlist', username:req.signedCookies.admit});
});

// 사용자가 플레이리스트를 관리하는 페이지를 위한 코드.
app.get('/admin', (req, res) => {
    res.render('admin', {status: 'admin', username:req.signedCookies.admit});
});
// 해당 페이지에서, 노래들을 수정, 삭제, 추가하기 위한 코드들.
// post, put, delete 메소드들을 사용.
app.post('/admin', (req, res) => {
    const {artist, title} = req.body;
    const id = Date.now();
    playlist_data[req.signedCookies.admit][id] = {artist, title};
    res.end();
})
app.put('/admin/:key', (req, res) => {
    const {artist, title} = req.body;
    playlist_data[req.signedCookies.admit][req.params.key] = {artist, title};
    res.end();
});
app.delete('/admin/:key', (req, res) => {
    delete playlist_data[req.signedCookies.admit][req.params.key];
    res.end();
});
// 오류 처리를 위한 코드.
app.use((err, req, res, next) => {
    res.status(401).send(err.message);
});
// 서버 연결을 위한 코드.
app.listen(app.get('port'), () => {
    console.log('App listneing')
});