import { EntityRepository, Repository } from 'typeorm';
import { ChatMessage, ChatMessage_ } from '../model/entity/chat_message.entity';

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
    const message = this.create({
      textMessage,
      chatId,
      userId,
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
    return this.createQueryBuilder(ChatMessage_.TN)
      .where(`${ChatMessage_.TN}.${ChatMessage_.ID} > :lastId`)
      .andWhere(`${ChatMessage_.TN}.${ChatMessage_.CHAT_ID} = :chatId`)
      .setParameters({ chatId, lastId })
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
