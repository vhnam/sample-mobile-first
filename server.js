const express = require('express');
const path = require('path');
const fs = require('fs');
const compression = require('compression');
const spdy = require('spdy');

const app = express();

if ('production' !== process.env.NODE_ENV) {
  require('dotenv').config();
}

const options = {
  key: fs.readFileSync(__dirname + '/certs/server.key'),
  cert: fs.readFileSync(__dirname + '/certs/server.crt'),
};

app.disable('x-powered-by');

app.use(compression());
app.use('/assets', express.static('assets'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

spdy.createServer(options, app).listen(process.env.NODE_PORT, (error) => {
  if (error) {
    console.error(error);
    return process.exit(1);
  } else {
    console.log('Server is running');
  }
});
