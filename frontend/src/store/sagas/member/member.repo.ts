import axios from "axios";
import server from 'config/server';
import { InitMember } from "utils/types/entity.type";

class AuthRepo {
  public async signUp(member: Partial<InitMember>, fileIdx: number|null) {
    const { id, pw, name, intro } = member;

    const resp = await axios.post(`${server.apiHost}/auth/signup`, {
      id,
      pw,
      name,
      intro,
      profileImg: fileIdx,
    });

    return resp.data;
  }

  public async updateProfile(member: Partial<InitMember>, fileIdx: number|null) {
    const { pw, name, intro } = member;

    const resp = await axios.put(`${server.apiHost}/auth/`, {
      pw,
      name,
      intro,
      profileImg: fileIdx,
    }, {
      headers: {
        token: sessionStorage.getItem('token'),
      },
    });

    return resp.data;
  }

  public async getUserInfo() {
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

export default new AuthRepo();
