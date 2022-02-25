import { EntityRepository, Repository } from 'typeorm';
import { ChatMessage, ChatMessage_ } from '../model/entity/chat_message.entity';
import { MessageType } from '../model/enums/message_type.enum';

@EntityRepository(ChatMessage)
export class ChatMessageRepository extends Repository<ChatMessage> {
  public async createMessage({
    chatId,
    userId,
    textMessage,
  }: {
    chatId: number;
    userId: number;
    textMessage?: string;
  }): Promise<ChatMessage> {
    const messageType = MessageType.TEXT;

    const message = this.create({
      textMessage,
      chatId,
      userId,
      messageType,
    });

    return this.save(message);
  }

  public async getMessages({
    chatId,
    takeCount,
    lastId,
  }: {
    chatId: number;
    takeCount: number;
    lastId: number | undefined;
  }): Promise<ChatMessage[]> {
    const query = this.createQueryBuilder(ChatMessage_.TN);
    if (lastId) {
      query.where(`${ChatMessage_.TN}.${ChatMessage_.ID} > :lastId`);
    }

    return query
      .andWhere(`${ChatMessage_.TN}.${ChatMessage_.CHAT_ID} = :chatId`)
      .setParameters({ chatId, lastId })
      .orderBy(`${ChatMessage_.TN}.${ChatMessage_.CREATED_AT}`, 'DESC')
      .limit(takeCount)
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
