import Joi from '@hapi/joi';

export const login = (body) => {
  const schema = Joi.object().keys({
    id: Joi.string().required(),
    pw: Joi.string().required(),
  });

  return schema.validateAsync(body);
};

export const signUp = (body) => {
  const schema = Joi.object().keys({
    id: Joi.string().required(),
    pw: Joi.string().required(),
    name: Joi.string().required(),
    intro: Joi.string(),
    profileImg: Joi.number().integer(),
  });

  return schema.validateAsync(body);
};
