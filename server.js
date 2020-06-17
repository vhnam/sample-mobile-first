const express = require('express');
const path = require('path');
const fs = require('fs');
const compression = require('compression');
const http2 = require('spdy');

const app = express();

if ('production' !== process.env.NODE_ENV) {
  require('dotenv').config();
}

const options = {
  key: fs.readFileSync(__dirname + '/certs/server.key'),
  cert: fs.readFileSync(__dirname + '/certs/server.crt'),
};

const manifest = JSON.parse(fs.readFileSync('./manifest.json'));

const pushAsset = (res, path, type, file) => {
  res.push(
    path,
    {
      status: 200,
      method: 'GET',
      request: {
        accept: '*/*',
      },
      response: {
        'content-type': type,
      },
    },
    (error, stream) => {
      if (error) {
        return;
      }
      stream.end(file);
    },
  );
};

const pushGeneralAssets = (res) => {
  let content;
  Object.keys(manifest).forEach((group) => {
    manifest[group].forEach((file) => {
      content = fs.readFileSync(__dirname + file.path);
      pushAsset(res, file.path, file.type, content);
    });
  });
};

app.disable('x-powered-by');

app.use(compression());
app.use('/assets', express.static('assets'));

app.get('/', (req, res) => {
  if ('production' === process.env.NODE_ENV) {
    pushGeneralAssets(res);
  }
  res.sendFile(path.join(__dirname + '/index.html'));
});

http2.createServer(options, app).listen(process.env.NODE_PORT, (error) => {
  if (error) {
    console.error(error);
    return process.exit(1);
  } else {
    console.log('Server is running');
  }
});
