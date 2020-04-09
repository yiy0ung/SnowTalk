
export function existToken() {
  let token = null;
  const sessionToken = sessionStorage.getItem('token');

  if(sessionToken) {
    token = sessionToken;
  }

  return token;
}
