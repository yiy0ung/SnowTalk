import Server from "./server";
import config from './config';

const { port } = config;

try {
  const server = new Server();
  
  server.run(port);
} catch (error) {
  console.error('서버 예러 발생');
  console.error(error);
}
