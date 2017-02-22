const path = require('path');
const http = require('http');
const fs = require('fs');

const port = process.env.OPENSHIFT_NODEJS_PORT || process.env.VCAP_APP_PORT || process.env.PORT || process.argv[2] || 3666;
const ip = process.env.HOST || '127.0.0.1';

const Gun = require('./lib/server');

const gun = Gun({
  s3: {
    key: 'AKIAJXIBHCN7MYWEEWEQ', // AWS Access Key
    secret: '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', // AWS Secret Token
    bucket: 'gun-db-robbestad' // The bucket you want to save into
  }
});

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
