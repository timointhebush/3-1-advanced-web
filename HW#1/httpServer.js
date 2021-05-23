const http = require('http');
const fs = require('fs').promises

const hostname = '127.0.0.1';
const port = 3001;

// 힙합 레이블, CEO, 아티스트의 정보를 저장한 변수
const labels = [ { label:'앰비션뮤직', CEO:'The quiett', artist:'창모' },
                    { label:'AOMG', CEO:'박재범', artist:'로꼬' },
                    { label:'VMC', CEO:'Deepflow', artist:'넉살' } ];
let find = { };

http.createServer(async (req, res) => {
    try {
        //GET 요청
        if (req.method === 'GET') {
            if (req.url === '/') {
                console.log('GET /');
                const data = await fs.readFile('./index.html');
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8'});
                return res.end(data);
            } else if (req.url === '/ambition') {
                console.log('GET /ambition');
                const data = await fs.readFile('./ambition.html');
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8'});
                return res.end(data);
            } else if (req.url === '/aomg') {
                console.log('GET /aomg');
                const data = await fs.readFile('./aomg.html');
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8'});
                return res.end(data);
            } else if (req.url === '/vmc') {
                console.log('GET /vmc');
                const data = await fs.readFile('./vmc.html');
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8'});
                return res.end(data);
            // 힙합 레이블을 입력하면 대표 이름을 출력해줌
            } else if (req.url === '/labelAnswer') {
                let answer = 'no answer';
                labels.forEach( (name) => {
                    if (name.label === find.label) {
                        answer = name.CEO;
                    } 
                });
                console.log(`GET /answer: ${find.label}-${answer}`);
                res.writeHead(201, { 'Content-Type': 'text/html; charset=utf-8'});
                return res.end( answer );
            // 라디오 버튼에서 아티스트를 선택하면 해당 레이블을 출력해줌
            } else if (req.url === '/artistAnswer') {
                let answer = 'no answer';
                labels.forEach( (name) => {
                    if (name.artist === find.artist) {
                        answer = name.label;
                    } 
                });
                console.log(`GET /answer: ${find.label}-${answer}`);
                res.writeHead(201, { 'Content-Type': 'text/html; charset=utf-8'});
                return res.end( answer );
            }

            // 이미지, 자바스크립트 등을 요청하는 경우 처리하기 위한 try, catch
            try {
                const data = await fs.readFile(`.${req.url}`);
                return res.end(data);
            } catch(err) {
                console.log(err);
                res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8'});
                return res.end('NOT FOUND');
            }
        
        // POST 요청
        } else if (req.method === 'POST') {
            // 레이블 이름을 입력한 경우
            // find변수에 해당 값을 저장
            if (req.url === '/labelName') {
                req.on('data', (data) => {
                    console.log('POST /labelName data:', data.toString());
                    find = JSON.parse(data);
                    res.writeHead(201, { 'Content-Type': 'text/plain; charset=utf-8'});
                    return res.end('ok');
                })
            // 라디오 버튼에서 아티스트를 선택한 경우 해당 값을 find 변수에 저장.
            } else if (req.url === '/artistName') {
                req.on('data', (data) => {
                    console.log('POST /artistName data:', data.toString());
                    find = JSON.parse(data);
                    res.writeHead(201, { 'Content-Type': 'text/plain; charset=utf-8'});
                    return res.end('ok');
                })
            }
        }
    } catch (err) {
        console.error(err);
        res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8'});
        res.end(err.message);
    }
})
    .listen(port, hostname, () => {
        console.log('3001번 포트로 연결')
    });