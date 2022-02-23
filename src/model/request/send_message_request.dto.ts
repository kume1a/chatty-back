export class SendChatMessageRequestDto {
  readonly chatId: number;
  readonly textMessage?: string | undefined;
}
