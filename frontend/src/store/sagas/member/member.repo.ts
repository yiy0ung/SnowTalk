import axios from 'axios';
import server from 'config/server';

class MemberRepo {

  public async login(id: string, pw: string) {
    const res = await axios.post(`${server.apiHost}/auth/login`, {
      id,
      pw,
    });

    return res.data;
  }

  public async getMyInfo() {
    const res = await axios.get(`${server.apiHost}/member/my`, {
      headers: {
        token: sessionStorage.getItem('token'),
      },
    });

    return res.data;
  }

  public async getFriends() {
    const res = await axios.get(`${server.apiHost}/member/friend`, {
      headers: {
        token: sessionStorage.getItem('token'),
      },
    });

    return res.data;
  }

  public async appendFriends(friendId: number) {
    console.log(friendId, typeof friendId);
    const res = await axios.post(`${server.apiHost}/member/friend`, {
      friendId,
    }, {
      headers: {
        token: sessionStorage.getItem('token'),
      },
    });

    return res.data;
  }

  public async removeFriends(friendIdx: number) {
    const res = await axios.delete(`${server.apiHost}/member/friend`, {
      headers: {
        token: sessionStorage.getItem('token'),
      },
      params: {
        friend_idx: friendIdx,
      },
    });

    return res.data;
  }
}

export default new MemberRepo();
