import { IsNumber, IsOptional, IsString } from 'class-validator';

export class SendChatMessageRequestDto {
  @IsNumber()
  readonly chatId: number;

  @IsOptional()
  @IsString()
  readonly textMessage?: string | undefined;
}
