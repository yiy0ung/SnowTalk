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
}

export default new AuthRepo();
