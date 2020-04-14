import axios from "axios";
import server from 'config/server';
import { InitMember } from "utils/types/entity.type";

class AuthRepo {
  public async signUp(member: Partial<InitMember>, fileIdx: number|null) {
    const { id, pw, name, intro } = member;

    const resp = await axios.post(`${server.host}/auth/signup`, {
      id,
      pw,
      name,
      intro,
      profileImg: fileIdx,
    });

    return resp.data;
  }

  public async updateProfile(member: Partial<InitMember>) {
    const { pw, name, intro, profileImg } = member;

    const resp = await axios.put(`${server.host}/auth/`, {
      pw,
      name,
      intro,
      profileImg,
    });

    return resp.data;
  }
}

export default new AuthRepo();
