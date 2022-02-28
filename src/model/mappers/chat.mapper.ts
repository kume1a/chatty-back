import { Chat } from '../entity/chat.entity';
import { ChatDto } from '../response/chat.dto';
import { Injectable } from '@nestjs/common';
import { ChatEntryView } from '../entity/view/chat_entry.view';
import { UserDto } from '../response/user.dto';
import { ChatMessageDto } from '../response/chat_message.dto';

@Injectable()
export class ChatMapper {
  public mapFromEntryView(v: ChatEntryView): Promise<ChatDto> | ChatDto {
    const user = new UserDto(
      v.userId,
      v.userFirstName,
      v.userLastName,
      undefined,
    );
    const lastMessage = new ChatMessageDto(
      v.lastChatMessageId,
      undefined,
      undefined,
      v.lastChatMessageMessageType,
      v.lastChatMessageTextMessage,
      v.lastChatMessageImageFilePath,
      v.lastChatMessageVideoFilePath,
      v.lastChatMessageVoiceFilePath,
      undefined,
      v.lastChatMessageCreatedAt,
      undefined,
    );
    return new ChatDto(v.chatId, v.chatCreatedAt, user, lastMessage);
  }

  public mapFromEntity(chat: Chat): Promise<ChatDto> | ChatDto {
    return new ChatDto(chat.id, chat.createdAt, undefined, undefined);
  }
}
