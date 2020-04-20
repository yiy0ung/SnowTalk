import redis from 'async-redis';
import config from '../../../config';

const { sesstionStorage } = config;

const redisClient = redis.createClient({
  host: sesstionStorage.host,
  port: sesstionStorage.port,
  family: sesstionStorage.family,
  retry_strategy: (options) => (options.attempt * 5),
});

redisClient.on('connect', () => {
  console.log('Connected to Redis Session Storage');
});

redisClient.on('error', (error) => {
  console.error(`Failed to connect Redis Database : ${error}`);
});

export function joinChatRoom() {

}
