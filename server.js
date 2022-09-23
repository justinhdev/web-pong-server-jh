/*const io = require("socket.io")(process.env.PORT, {
  cors: {
    origin: ["http://127.0.0.1:5501"],
  },
});*/
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    
    origin: "http://127.0.0.1:5501"
  }
});
const PORT = process.env.PORT || 3000;
/*origin: "https://web-2pong.netlify.app"*/
//app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send("server is up");
});

/*app.get('/client/script.js', (req, res) => {
  res.sendFile('/home/huginn/code/online-pong/client/script.js');
});*/

server.listen(PORT, () => {
  
});

var index = new Array();
var spot;
var rdycount = 0;

io.on("connection", (socket) => {
  
  index.push(socket.id);
  io.emit("getIndex", index);

  socket.on("startGame-send", () => {
    io.emit("startGame-recieve");
  });
  socket.on("mousePosition-send1", (mousePos) => {
    io.emit("mousePosition-recieve1", mousePos);
  });
  socket.on("mousePosition-send2", (mousePos) => {
    io.emit("mousePosition-recieve2", mousePos);
  });
  socket.on("gameOver-send", () => {
    socket.emit("gameOver-recieve");
  });
  socket.on("getHeading", () => {
    var test = 0;
    while (
      Math.abs(test) <= 0.2 ||
      Math.abs(test) >= 0.9
    ) {
      var heading = randomNumberBetween(0, 2 * Math.PI)
      test = Math.cos(heading);
    }
    io.emit("getHeading-send", heading);
  });
  socket.on("hitAudio", () => {
    io.emit("hitAudio-send");
  })
  socket.on("missAudio", () => {
    io.emit("missAudio-send");
  })
  socket.on("ready-send", () => {
    rdycount++;
    if (rdycount > 1) {
      io.emit("ready-recieve");
      rdycount = 0;
    }
    else {
      io.emit("ready-waiting");
    }
  })
  socket.on("disconnect", () => {
    rdycount = 0;
    spot = index.indexOf(socket.id);
    index.splice(spot, 1);
    io.emit("getIndex", index);
  });
});

function randomNumberBetween(min, max) {
  return Math.random() * (max - min) + min;
}