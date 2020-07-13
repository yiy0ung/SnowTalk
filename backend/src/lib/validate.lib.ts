import Joi from '@hapi/joi';

export const login = (body) => {
  const schema = Joi.object().keys({
    id: Joi.string().regex(/^[a-zA-Z0-9]{6,20}$/).required(),
    pw: Joi.string().regex(/^[a-zA-Z0-9]{5,20}$/).required(),
  });

  return schema.validateAsync(body);
};

export const signUp = (body) => {
  const schema = Joi.object().keys({
    id: Joi.string().regex(/^[a-zA-Z0-9]{6,20}$/).required(),
    pw: Joi.string().regex(/^[a-zA-Z0-9]{5,20}$/).required(),
    name: Joi.string().min(1).required(),
    intro: Joi.string().max(40),
    profileImg: Joi.number().integer().allow(null),
  });

  return schema.validateAsync(body);
};

export const updateMember = (body) => {
  const schema = Joi.object().keys({
    pw: Joi.string(),
    name: Joi.string(),
    intro: Joi.string(),
    profileImg: Joi.number().integer().allow(null),
  });

  return schema.validateAsync(body);
};

export const getMessage = (body) => {
  const schema = Joi.object().keys({
    roomIdx: Joi.number().integer().required(),
    lastMessageIdx: Joi.number().integer(),
  });

  return schema.validateAsync(body);
}
