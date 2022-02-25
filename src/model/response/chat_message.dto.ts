import { MessageType } from '../enums/message_type.enum';

export class ChatMessageDto {
  constructor(
    readonly id: number,
    readonly type: MessageType,
    readonly textMessage: string,
    readonly imageUrl: string,
    readonly videoUrl: string,
    readonly gifUrl: string,
    readonly createdAt: Date,
  ) {}
}
