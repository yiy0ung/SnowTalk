import jwt from 'jsonwebtoken';
import config from '../config';

const { jwtSecret } = config;

// expiresIn format 7 days, 10h, 7d, 3min, 100 => 100ms
export const createToken = (memberIdx: number, memberId: string) => { // Create Token
  const payload = {
    memberIdx, memberId,
  };
  const option = { expiresIn: '5 days', issuer: 'snowtalk.com', subject: 'token' };

  try {
    return jwt.sign(payload, jwtSecret, option);
  } catch (error) {
    throw error;
  }
};

export const createRefreshToken = (memberIdx: number, memberId: string) => { // Create Refresh Token
  const payload = {
    memberIdx, memberId,
  };
  const option = { expiresIn: '7 days', issuer: 'snowtalk.com', subject: 'refreshToken' };

  try {
    return jwt.sign(payload, jwtSecret, option);
  } catch (error) {
    throw error;
  }
};

export const verifyToken = (token: string) => { // Verify Token
  try {
    return jwt.verify(token, jwtSecret);
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

export const decodeToken = (token: string) => { // Decode Token
  try {
    return jwt.decode(token);
  } catch (error) {
    throw error;
  }
};

export const searchTokenError = (error: Error) => { // Checking Token error
  let status = null;
  let message = null;

  switch (error.message) {
    case 'jwt must be provided':
      status = 400;
      message = '토큰이 전송되지 않았습니다';
      break;
    case 'jwt malformed':
    case 'invalid token':
    case 'invalid signature':
      status = 401;
      message = '위조된 토큰입니다';
      break;
    case 'jwt expired':
      status = 410;
      message = '토큰이 만료되었습니다';
      break;
    default:
      console.log(error.message);
      status = 500;
      message = '다시 시도해 주세요';
      break;
  }

  return [status, message];
};
