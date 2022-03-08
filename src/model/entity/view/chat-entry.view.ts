import { MessageType } from '../../enums/message-type.enum';

export interface ChatEntryView {
  readonly chatId: number;
  readonly chatCreatedAt: Date;
  readonly chatName: string | undefined;
  readonly userId: number;
  readonly userFirstName: string;
  readonly userLastName: string;
  readonly userProfileImagePath: string | undefined;
  readonly lastChatMessageId: number;
  readonly lastChatMessageCreatedAt: Date;
  readonly lastChatMessageMessageType: MessageType;
  readonly lastChatMessageTextMessage: string | null;
  readonly lastChatMessageImageFilePath: string | null;
  readonly lastChatMessageVoiceFilePath: string | null;
  readonly lastChatMessageVideoFilePath: string | null;
  readonly lastChatMessageFilePath: string | null;
}
