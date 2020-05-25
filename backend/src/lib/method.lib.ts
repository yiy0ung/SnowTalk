import crypto from 'crypto';
import { v4 as uuid4 } from 'uuid';

export const generateId = () => {
  let id: string = uuid4();
  const token = id.split('-');

  id = token[2] + token[1] + token[0] + token[3] + token[4];

  return id;
};

export const hashPersonalChatCode = (idxs: number[]) => {
  if (idxs.length !== 2) {
    return null;
  }

  const hash = crypto.createHash('sha1').update(idxs.sort().join()).digest('hex');

  return hash;
};
