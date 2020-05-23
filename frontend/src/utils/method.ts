
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
