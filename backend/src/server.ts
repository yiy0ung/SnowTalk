import 'reflect-metadata';

import HTTP from 'http';
import express, { Express } from 'express';
import cors from 'cors';
import { Container } from 'typedi';

import connectDB from './database/connection';
import RootRouter from './controllers';

class Server {
  public app: Express;
  public server: HTTP.Server;

  constructor() {
    this.app = express();
    this.server = HTTP.createServer(this.app);
  }

  private setRouter() {
    this.app.use('/api', Container.get(RootRouter).getRouter());
  }

  private setMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  public async run(port: string) {
    await connectDB();

    this.setMiddleware();
    this.setRouter();

    this.server.listen(port, () => {
      console.log(`SnowTalk Server is started on port ${port}`);
    });
  }
}

export default Server;
