const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const documentRoutes = require('./routes/documentRoutes');

const http = require('http');
const socketIo = require('socket.io');
const Y = require('yjs');
const { WebsocketProvider } = require('y-websocket');

require('dotenv').config();
require('./config/passport');

const app = express();
console.log('env', process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/documents', documentRoutes);

const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('New client connected');

  const ydoc = new Y.Doc();
  const provider = new WebsocketProvider('wss://demos.yjs.dev', 'my-room', ydoc);

  socket.on('document-update', (update) => {
    Y.applyUpdate(ydoc, update);
    socket.broadcast.emit('document-update', update);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
