
export function createKey(numLength: number) {
  const numberSize = Math.pow(10, numLength);
  let result = Math.floor(Math.random() * numberSize) + (numberSize / 10);

  if (result > numberSize) {
    result -= (numberSize / 10);
  }

  return result;
}