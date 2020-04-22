import Joi from '@hapi/joi';
import { RoomType } from '../../../database/enum/ChatType';

export const createChatRoom = (body) => {
  const schema = Joi.object().keys({
    membersIdx: Joi.array().items(Joi.number().integer()).required(),
    title: Joi.string().max(10),
    type: Joi.string().valid(
      String(RoomType.personal), 
      String(RoomType.group),
    ).required(),
  });

  return schema.validateAsync(body);
};


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

export const sendRoomMessage = (data) => {
  const schema = Joi.object().keys({
    roomIdx: Joi.number().integer().required(),
    message: Joi.string().required(),
    imageIdx: Joi.number().integer().allow(null),
  });

  return schema.validateAsync(data);
};
