import axios from "axios";
import server from "config/server";

class UploadRepo {
  public async uploadImg(files: File[]) {
    const formData = new FormData();
    
    for (const file of files) {
      formData.append('image', file);
    }

    const resp = await axios.post(`${server.host}/upload/image`, formData);

    return resp.data;
  }
}

export default new UploadRepo();
