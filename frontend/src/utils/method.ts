import crypto from 'crypto';

export function createKey(numLength: number) {
  const numberSize = Math.pow(10, numLength);
  let result = Math.floor(Math.random() * numberSize) + (numberSize / 10);

  if (result > numberSize) {
    result -= (numberSize / 10);
  }

  return result;
}

export function trimNextLine(str: string) {
  let result = str.trim();

  const arrStr: (string|null)[] = result.split('\n');
  if (arrStr[0] === '') {
    arrStr[0] = null;
  }
  if (arrStr[arrStr.length - 1] === '') {
    arrStr[arrStr.length - 1] = null;
  }
  result = arrStr.join('\n').trim();

  return result;
}

export const hashPersonalChatCode = (idxs: number[]) => {
  if (idxs.length !== 2) {
    return null;
  }

  const hash = crypto.createHash('sha1').update(idxs.sort().join()).digest('hex');

  return hash;
};

