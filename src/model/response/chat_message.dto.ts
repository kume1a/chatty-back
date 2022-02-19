export class ChatMessageDto {
  constructor(
    readonly id: number,
    readonly type: string,
    readonly textMessage: string,
    readonly imageUrl: string,
    readonly videoUrl: string,
    readonly gifUrl: string,
    readonly createdAt: Date,
  ) {}
}
