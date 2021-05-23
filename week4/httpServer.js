const http = require('http');
const fs = require('fs').promises

const hostname = '127.0.0.1';
const port = 3001;

const developer = [ { tech:'nodejs', name:'Ryan Dahl' },
                    { tech:'www', name:'Tim Berners-Lee' },
                    { tech:'tcpip', name:'Vinton Cerf' } ];
let find = { };

http.createServer(async (req, res) => {
    try {
        if (req.method === 'GET') {
            if (req.url === '/') {
                console.log('GET /');
                const data = await fs.readFile('./index.html');
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8'});
                return res.end(data);
            } else if (req.url === '/nodejs') {
                console.log('GET /nodejs');
                const data = await fs.readFile('./nodejs.html');
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8'});
                return res.end(data);
            } else if (req.url === '/answer') {
                let answer = 'no answer';
                developer.forEach( (dev) => {
                    if (dev.tech === find.tech) {
                        answer = dev.name;
                    } 
                });
                console.log(`GET /answer: ${find.tech}-${answer}`);
                res.writeHead(201, { 'Content-Type': 'text/html; charset=utf-8'});
                return res.end( answer );
            }

            try {
                const data = await fs.readFile(`.${req.url}`);
                return res.end(data);
            } catch(err) {
                console.log(err);
                res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8'});
                return res.end('NOT FOUND');
            }

        } else if (req.method === 'POST') {
            if (req.url === '/webtech') {
                req.on('data', (data) => {
                    console.log('POST /webtech data:', data.toString());
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

    });