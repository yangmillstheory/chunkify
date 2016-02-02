import {createServer} from 'http';
import {parse} from 'url';
import {createReadStream} from 'fs';


export function serve() {
  'use strict';
  createServer(function(request, response) {
    let url = request.url;
    if (url === '/favicon.ico') {
      response.writeHead(200, {'Content-Type': 'image/x-icon'});
      response.end();
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
      response.writeHead(404);
    }
  })
  .listen(8080);
};
