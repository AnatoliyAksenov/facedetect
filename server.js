var express = require('express');
var http = require("http");
var fs = require("fs");

// Create a new Express application.
var app = express();

/**
 * Server configuration.
 */
var port = process.env.port || 8080;
var address = process.env.address || '0.0.0.0';

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'RosEuroBank developers the best!', resave: true, saveUninitialized: true }));

//html app
app.use('/', express.static('public/app'));

app.get('/test',  
  function(req, res){    
      res.status(200).json({result:'result', error:null});    
});

app.get('/teapot',
  function(req,res){
    res.sendStatus(418);
  });

app.use(function(req, res){
  res.sendStatus(404);
});

// HTTP server
var server = http.createServer(app);
server.listen(port, function () {
  console.log('HTTP server listening on port ' + port);
});

// WebSocket server
var io = require('socket.io')(server);

// OpenCV
var cv = require('opencv');

// camera properties
var camWidth = 320;
var camHeight = 240;
var camFps = 10;
var camInterval = 1000 / camFps;

// face detection properties
var rectColor = [0, 255, 0];
var rectThickness = 2;

// initialize camera
let filename = 'C:/rosbank/facedetect/test.avi';//__dirname + '\\test.mp4';
console.log(filename);
console.log(` is file exists: ${fs.statSync(filename).isFile()}`);
var camera = new cv.VideoCapture(filename);//cv.VideoCapture(0);



camera.setWidth(camWidth);
camera.setHeight(camHeight);
io.on('connection', function (socket) {
  setInterval(function() {
    camera.read(function(err, im) {
      if (err) throw err;
      socket.emit('frame', { buffer: im.toBuffer() });

      /*
      im.detectObject('./node_modules/opencv/data/haarcascade_frontalface_alt2.xml', {}, function(err, faces) {
        if (err) throw err;

        for (var i = 0; i < faces.length; i++) {
          face = faces[i];
          im.rectangle([face.x, face.y], [face.width, face.height], rectColor, rectThickness);
        }

        socket.emit('frame', { buffer: im.toBuffer() });
      });
      */
    });
  }, camInterval);
});