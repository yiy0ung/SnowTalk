import "reflect-metadata";
import { Container } from 'typedi';
import { createConnection, useContainer, ConnectionOptions } from 'typeorm';

import config from '../config';
import dbConfig from '../config/database';

const { host, port, name, user, pw } = dbConfig;

async function connectDatabase() {
  try {
    const devEnv = config.nodeEnv === 'development';

    const options: ConnectionOptions = {
      type: "mysql",
      host,
      port,
      username: user,
      password: pw,
      database: name,
      entities: [`${__dirname}/models/*{.ts,.js}`],
      timezone: 'local',
      synchronize: true && devEnv,
      dropSchema: true && devEnv,
      logging: false,
      cache: false,
    };

    useContainer(Container);
    await createConnection(options).then(_ => {
      console.log('DB connected');
    }).catch((error) => {
      console.error('DB connection failed');
      console.error(error);
    });
  } catch (error) {
    throw error;
  }
}

export default connectDatabase;
