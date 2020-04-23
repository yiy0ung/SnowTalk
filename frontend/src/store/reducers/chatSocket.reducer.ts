import { createAction, ActionType } from "typesafe-actions";


export const SUBSCRIBE_CHAT_SOCKET = 'SUBSCRIBE_CHAT_SOCKET';
export const UNSUBSCRIBE_CHAT_SOCKET = 'UNSUBSCRIBE_CHAT_SOCKET';

export const subscribeChatSocket = createAction(SUBSCRIBE_CHAT_SOCKET)();
export const unsubscribeChatSocket = createAction(UNSUBSCRIBE_CHAT_SOCKET)();

const actions = {
  subscribeChatSocket,
  unsubscribeChatSocket,
}
export type ChatSocketActions = ActionType<typeof actions>;
