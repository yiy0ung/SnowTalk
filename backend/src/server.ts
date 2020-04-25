import 'reflect-metadata';

import HTTP from 'http';
import path from 'path';
import express, { Express } from 'express';
import cors from 'cors';
import serveStatic from 'serve-static';
import socketIo from 'socket.io';
import { Container } from 'typedi';

import connectDB from './database/connection';
import RootRouter from './controllers';
import { runSocket } from './socket';

class Server {
  public app: Express;
  public server: HTTP.Server;
  public socket: socketIo.Server;

  constructor() {
    this.app = express();
    this.server = HTTP.createServer(this.app);
    this.socket = socketIo(this.server, {
      path: '/socket',
      origins: '*',
    });
  }

  private setRouter() {
    this.app.use('/api', Container.get(RootRouter).getRouter());
  }

  private setMiddleware() {
    this.app.use(cors());
    this.app.use('/static', serveStatic(path.join(__dirname, 'public')));
    this.app.use(express.json());
  }

  private setSocketEvent() {
    runSocket(this.socket);
  }

  public async run(port: string) {
    await connectDB();

    this.setMiddleware();
    this.setRouter();
    this.setSocketEvent();

    this.server.listen(port, () => {
      console.log(`SnowTalk Server is started on port ${port}`);
    });
  }
}

export default Server;
