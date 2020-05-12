import redis from 'async-redis';
import { Namespace } from 'socket.io';
import config from '../../../config';
import { Member } from '../../../database/models/Member';

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

export async function registerSocket(nmsp: Namespace, memberId: string, socketId: string) {
  await redisClient.hmset(`${nmsp.name}-online`, memberId, socketId);

  return true;
}

export async function disconnectSocket(nmsp: Namespace, memberId: string) {
  await redisClient.hdel(`${nmsp.name}-online`, memberId);

  return true;
}

export async function joinChatRoom(nmsp: Namespace, roomidx: number, members: Member[]) {
  await Promise.all(members.map(async (member: Member) => {
    const socketId = await redisClient.hget(`${nmsp.name}-online`, member.id);

    if (socketId && nmsp.connected[socketId]) {
      nmsp.connected[socketId].join(`chatroom-${roomidx}`);
    }
  }));
}
