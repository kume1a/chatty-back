import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ToInt } from '../../decorator/transforms.decorator';

export class SendChatMessageRequestDto {
  @ToInt()
  @IsNumber()
  readonly chatId: number;

  @IsOptional()
  @IsString()
  readonly textMessage?: string | undefined;
}
