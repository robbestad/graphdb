const path = require('path');
const http = require('http');
const fs = require('fs');
const config = require('./config');

const port = process.env.OPENSHIFT_NODEJS_PORT || process.env.VCAP_APP_PORT || process.env.PORT || process.argv[2] || 3666;
const ip = process.env.HOST || '127.0.0.1';

const Gun = require('./lib/server');

const gun = Gun(config.s3);

const server = http.createServer(function (req, res) {
  if (gun.wsp.server(req, res)) {
    return; // filters gun requests!
  }
  fs.createReadStream(path.join(__dirname, req.url)).on('error', () => { // static files!
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(fs.readFileSync(path.join(__dirname, 'index.html'))); // or default to index
  }).pipe(res); // stream
});
gun.wsp(server);
server.listen(port, ip);

console.log('Server started on port', port, 'with /gun');
