import Joi from '@hapi/joi';

export const inviteChatRoom = (body) => {
  const schema = Joi.object().keys({
    roomIdx: Joi.number().integer().required(),
    membersIdx: Joi.array().items(Joi.number().integer()).required(),
  });

  return schema.validateAsync(body);
};

export const leaveChatRoom = (body) => {
  const schema = Joi.object().keys({
    roomIdx: Joi.number().integer().required(),
  });

  return schema.validateAsync(body);
};