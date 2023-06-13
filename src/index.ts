import { staticDirectory } from './storage';

declare module 'socket.io' {
  interface Socket {
    userId?: string;
  }
}

import express, { Express } from 'express';
import * as mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { Server, Socket } from 'socket.io';
import router from './routes';
import cors from 'cors';

import { setListeners } from './listeners';
import { secret } from './config';

const DATABASE_CONNECTION =
  'mongodb+srv://petrkuzmenko04:12321@users.y8ys3wi.mongodb.net/?retryWrites=true&w=majority';

const port = process.env.PORT || '8000';
dotenv.config();

const app: Express = express();

const http = require('http');
const server = http.createServer(app);

const io = new Server(server, {
  allowEIO3: true,
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(express.json());
app.use(cors());
app.use('/', router);
app.use('/static', express.static(staticDirectory));

const startServer = async () => {
  try {
    // bd connection
    await mongoose.connect(DATABASE_CONNECTION);

    // socket init
    io.use((socket: Socket, next) => {
      const token = socket.handshake.query.token;
      if (typeof token === 'string') {
        jwt.verify(token, secret, (err, decoded) => {
          if (err) return;
          socket.userId = (decoded as { id: string }).id;
          next();
        });
      }
    }).on('connection', socket => setListeners(socket, io));

    // start server
    server.listen(port);
    console.log(`server started on port - ${port}`);
  } catch (e) {
    console.log(e);
  }
};

startServer().catch(null);
