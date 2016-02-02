'use strict';
var createServer = require('http').createServer;
var parse = require('url').parse;
var createReadStream = require('fs').createReadStream;

createServer(function(request, response) {
  let url = request.url;
  console.info(`Serving request for URL: ${url}`);
  if (url === '/favicon.ico') {
    response.writeHead(200, {'Content-Type': 'image/x-icon'});
    createReadStream('gh-pages/img/favicon.ico', {autoClose: true}).pipe(response);
  } else if (url === '/') {
    response.writeHead(200, {'Content-Type': 'text/html'});
    createReadStream('index.html', {autoClose: true}).pipe(response);
  } else if (url.endsWith('gh-pages/bundle.js')) {
    response.writeHead(200, {'Content-Type': 'application/javascript'});
    createReadStream(`./${parse(url).path}`, {autoClose: true}).pipe(response);
  } else if (url.endsWith('gh-pages/css/index.css')) {
    response.writeHead(200, {'Content-Type': 'text/css'});
    createReadStream(`./${parse(url).path}`, {autoClose: true}).pipe(response);
  } else if (url.endsWith('.png')) {
    response.writeHead(200, {'Content-Type': 'image/png'});
    createReadStream(`./${parse(url).path}`, {autoClose: true}).pipe(response);
  } else {
    console.error(`Returning 404 Not Found`);
    response.writeHead(404);
    response.write(`
<h1>404 Not Found</h1>

<p>
  Couldn't find a resource related to ${url}. The only available route is /.
</p>`);
    response.end();
  }
})
.listen(8080);
