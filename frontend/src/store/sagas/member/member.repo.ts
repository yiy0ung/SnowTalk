import axios from 'axios';
import server from 'config/server';

class MemberRepo {

  public async login(id: string, pw: string) {
    const res = await axios.post(`${server.host}/auth/login`, {
      id,
      pw,
    });

    return res.data;
  }

  public async getMyInfo() {
    const res = await axios.get(`${server.host}/member/my`, {
      headers: {
        token: localStorage.getItem('token'),
      },
    });

    return res.data;
  }

  public async getFriends() {
    const res = await axios.get(`${server.host}/member/friend`, {
      headers: {
        token: localStorage.getItem('token'),
      },
    });

    return res.data;
  }
}

export default new MemberRepo();
