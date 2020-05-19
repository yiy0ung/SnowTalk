import { Response } from "express";
import { Service } from "typedi";
import { AuthRequest } from "../../typings";
import * as Validate from '../../lib/validate.lib';
import { MessageService } from '../../services/message.service';

@Service()
export class ChatCtrl {
  constructor(
    private messageService: MessageService,
  ) {}

  public getChatMessage = async (req: AuthRequest, res: Response) => {
    const { decoded, body } = req;

    try {
      await Validate.getMessage(body);
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: 'bad request format',
      });

      return;
    }

    try {
      const { roomIdx, lastMessageIdx } = body;
      const messages = await this.messageService
        .getChatRoomMessage(decoded.memberIdx, roomIdx, lastMessageIdx);

      if (!messages) {
        res.status(403).json({
          status: 403,
          message: 'permission denined',
        });

        return;
      }

      res.status(200).json({
        status: 200,
        message: 'get messages',
        data: {
          messages,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 500,
        message: 'failed from server',
      });
    }
  }
}
