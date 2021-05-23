const http = require('http');

http.createServer((req, res) => {
    console.log(req.url, req.headers.cookie);
    res.writeHead(200, {'Set-Cookie' : ['class=AdvWeb', 'credits=3', 'professor=JYP']});
    res.write('Cookie testing');
    res.end('......');
})
    .listen(3000, () => {
        console.log('3000번 포트에서 JS서버 대기 중...')
    })