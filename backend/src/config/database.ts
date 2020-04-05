import config from './index';

const { database } = config;

const dbConfig = {
  development: {
    host: '127.0.0.1',
    port: 3306,
    name: 'snow-talk',
    user: 'root',
    pw: '1234',
  },
  production: {
    host: database.host,
    port: parseInt(database.port, 10),
    name: database.name,
    user: database.user,
    pw: database.pw,
  },
};

export default dbConfig[config.nodeEnv]

