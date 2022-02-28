import { EntityRepository, Repository } from 'typeorm';
import { ChatMessage, ChatMessage_ } from '../model/entity/chat_message.entity';
import { MessageType } from '../model/enums/message_type.enum';
import { ImageMeta_ } from '../model/entity/image_meta.entity';

@EntityRepository(ChatMessage)
export class ChatMessageRepository extends Repository<ChatMessage> {
  public async createMessage(p: {
    chatId: number;
    userId: number;
    messageType: MessageType;
    textMessage?: string | undefined;
    imageFilePath?: string | undefined;
    voiceFilePath?: string | undefined;
    videoFilePath?: string | undefined;
  }): Promise<ChatMessage> {
    const message = this.create({
      chatId: p.chatId,
      userId: p.userId,
      messageType: p.messageType,
      textMessage: p.textMessage,
      imageFilePath: p.imageFilePath,
      voiceFilePath: p.voiceFilePath,
      videoFilePath: p.videoFilePath,
    });

    return this.save(message);
  }

  public async getMessages(p: {
    chatId: number;
    takeCount: number;
    lastId: number | undefined;
  }): Promise<ChatMessage[]> {
    const query = this.createQueryBuilder(ChatMessage_.TN);
    if (p.lastId) {
      query.where(`${ChatMessage_.TN}.${ChatMessage_.ID} < :lastId`);
    }

    return query
      .andWhere(`${ChatMessage_.TN}.${ChatMessage_.CHAT_ID} = :chatId`)
      .leftJoinAndSelect(
        `${ChatMessage_.TN}.${ChatMessage_.RL_IMAGE_META}`,
        ImageMeta_.TN,
      )
      .orderBy(`${ChatMessage_.TN}.${ChatMessage_.CREATED_AT}`, 'DESC')
      .setParameters({ chatId: p.chatId, lastId: p.lastId })
      .limit(p.takeCount)
      .getMany();
  }

  public async getCount(chatId: number): Promise<number> {
    return this.createQueryBuilder(ChatMessage_.TN)
      .where(`${ChatMessage_.TN}.${ChatMessage_.CHAT_ID} = :chatId`, {
        chatId,
      })
      .getCount();
  }
}
