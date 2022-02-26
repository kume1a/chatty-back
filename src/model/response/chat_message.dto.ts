import { MessageType } from '../enums/message_type.enum';

export class ChatMessageDto {
  constructor(
    readonly id: number,
    readonly userId: number,
    readonly type: MessageType,
    readonly textMessage: string,
    readonly imageFilePath: string,
    readonly videoFilePath: string,
    readonly voiceFilePath: string,
    readonly gifUrl: string,
    readonly createdAt: Date,
  ) {}
}
