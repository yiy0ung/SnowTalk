import axios from 'axios';
import server from 'config/server';

class ChatRepository {
  public async getMessageRecord(roomIdx: number, lastMessageIdx?: number) {
    console.log(sessionStorage.getItem('token'));
    const resp = await axios.get(`${server.apiHost}/chat/msg`, {
      headers: {
        token: sessionStorage.getItem('token'),
      },
      params: {
        roomIdx,
        lastMessageIdx,
      },
    });

    return resp.data;
  }
}

export default new ChatRepository();
