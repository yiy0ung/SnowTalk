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
      synchronize: false && devEnv,
      dropSchema: false && devEnv,
      logging: false,
      cache: false,
    };

    useContainer(Container);
    const connection = await createConnection(options);

    if (connection) {
      console.log('Connected to DabaBase');
    }

    return connection;
  } catch (error) {
    console.error('Failed to connect Database');
    throw error;
  }
}

export default connectDatabase;
