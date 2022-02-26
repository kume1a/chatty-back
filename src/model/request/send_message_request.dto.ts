import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class SendChatMessageRequestDto {
  @Transform((v) => parseInt(v.value))
  @IsNumber()
  readonly chatId: number;

  @IsOptional()
  @IsString()
  readonly textMessage?: string | undefined;
}
