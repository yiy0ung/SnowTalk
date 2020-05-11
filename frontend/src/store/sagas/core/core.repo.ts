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
}

export default new MemberRepo();
