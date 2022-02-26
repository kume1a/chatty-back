import { EntityRepository, Repository } from 'typeorm';
import { Chat, Chat_ } from '../model/entity/chat.entity';
import { ChatMessage, ChatMessage_ } from '../model/entity/chat_message.entity';
import { ChatParticipant_ } from '../model/entity/chat_participant.entity';
import { User_ } from '../model/entity/user.entity';
import { ChatEntryView } from '../model/entity/view/chat_entry.view';

@EntityRepository(Chat)
export class ChatRepository extends Repository<Chat> {
  public async getChats({
    userId,
    lastId,
    takeCount,
  }: {
    userId: number;
    lastId: number;
    takeCount: number;
  }): Promise<ChatEntryView[]> {
    const query = this.createQueryBuilder(Chat_.TN)
      .leftJoin(
        (qb) =>
          qb
            .from(ChatMessage, ChatMessage_.TN)
            .orderBy(`${ChatMessage_.TN}.${ChatMessage_.ID}`, 'DESC')
            .take(1),
        ChatMessage_.TN,
        `${ChatMessage_.TN}."${ChatMessage_.CHAT_ID}" = ${Chat_.TN}.${Chat_.ID}`,
      )
      .leftJoin(
        `${Chat_.TN}.${Chat_.RL_CHAT_PARTICIPANTS}`,
        ChatParticipant_.TN,
      )
      .leftJoin(`${ChatParticipant_.TN}.${ChatParticipant_.RL_USER}`, User_.TN)
      .select(`${Chat_.TN}.${Chat_.ID}`, `${Chat_.TN}_${Chat_.ID}`)
      .addSelect(`${Chat_.TN}.${Chat_.NAME}`, `${Chat_.TN}_${Chat_.NAME}`)
      .addSelect(
        `${Chat_.TN}.${Chat_.CREATED_AT}`,
        `${Chat_.TN}_${Chat_.CREATED_AT}`,
      )
      .addSelect(`${User_.TN}.${User_.ID}`, `${User_.TN}_${User_.ID}`)
      .addSelect(
        `${User_.TN}.${User_.FIRST_NAME}`,
        `${User_.TN}_${User_.FIRST_NAME}`,
      )
      .addSelect(
        `${User_.TN}.${User_.LAST_NAME}`,
        `${User_.TN}_${User_.LAST_NAME}`,
      )
      .addSelect(
        `${User_.TN}.${User_.PROFILE_IMAGE_PATH}`,
        `${User_.TN}_${User_.PROFILE_IMAGE_PATH}`,
      )
      .addSelect(
        `${ChatMessage_.TN}."${ChatMessage_.ID}"`,
        `${ChatMessage_.TN}_${ChatMessage_.ID}`,
      )
      .addSelect(
        `${ChatMessage_.TN}."${ChatMessage_.MESSAGE_TYPE}"`,
        `${ChatMessage_.TN}_${ChatMessage_.MESSAGE_TYPE}`,
      )
      .addSelect(
        `${ChatMessage_.TN}."${ChatMessage_.TEXT_MESSAGE}"`,
        `${ChatMessage_.TN}_${ChatMessage_.TEXT_MESSAGE}`,
      )
      .addSelect(
        `${ChatMessage_.TN}."${ChatMessage_.IMAGE_FILE_PATH}"`,
        `${ChatMessage_.TN}_${ChatMessage_.IMAGE_FILE_PATH}`,
      )
      .addSelect(
        `${ChatMessage_.TN}."${ChatMessage_.VOICE_FILE_PATH}"`,
        `${ChatMessage_.TN}_${ChatMessage_.VOICE_FILE_PATH}`,
      )
      .addSelect(
        `${ChatMessage_.TN}."${ChatMessage_.VIDEO_FILE_PATH}"`,
        `${ChatMessage_.TN}_${ChatMessage_.VIDEO_FILE_PATH}`,
      )
      .where(`${ChatParticipant_.TN}.${ChatParticipant_.USER_ID} != :userId`)
      .orderBy(`${Chat_.TN}_${Chat_.ID}`, 'DESC');
    if (lastId) {
      query.andWhere(`${Chat_.TN}_${Chat_.ID} > :lastId`);
    }

    const rawData = await query
      .setParameters({ lastId, userId })
      .take(takeCount)
      .getRawMany();

    return rawData.map((e) => ({
      chatId: e[`${Chat_.TN}_${Chat_.ID}`],
      chatCreatedAt: e[`${Chat_.TN}_${Chat_.CREATED_AT}`],
      chatName: e[`${Chat_.TN}_${Chat_.NAME}`],
      userId: e[`${User_.TN}_${User_.ID}`],
      userFirstName: e[`${User_.TN}_${User_.FIRST_NAME}`],
      userLastName: e[`${User_.TN}_${User_.LAST_NAME}`],
      userProfileImagePath: e[`${User_.TN}_${User_.PROFILE_IMAGE_PATH}`],
      lastChatMessageId: e[`${ChatMessage_.TN}_${ChatMessage_.ID}`],
      lastChatMessageCreatedAt:
        e[`${ChatMessage_.TN}_${ChatMessage_.CREATED_AT}`],
      lastChatMessageMessageType:
        e[`${ChatMessage_.TN}_${ChatMessage_.MESSAGE_TYPE}`],
      lastChatMessageTextMessage:
        e[`${ChatMessage_.TN}_${ChatMessage_.TEXT_MESSAGE}`],
      lastChatMessageImageFilePath:
        e[`${ChatMessage_.TN}_${ChatMessage_.IMAGE_FILE_PATH}`],
      lastChatMessageVoiceFilePath:
        e[`${ChatMessage_.TN}_${ChatMessage_.VOICE_FILE_PATH}`],
      lastChatMessageVideoFilePath:
        e[`${ChatMessage_.TN}_${ChatMessage_.VIDEO_FILE_PATH}`],
    }));
  }

  public async countForUser(userId: number): Promise<number> {
    return this.createQueryBuilder(Chat_.TN)
      .leftJoin(
        `${Chat_.TN}.${Chat_.RL_CHAT_PARTICIPANTS}`,
        ChatParticipant_.TN,
      )
      .where(`${ChatParticipant_.TN}.${ChatParticipant_.USER_ID} = :userId`)
      .setParameters({ userId })
      .getCount();
  }

  public async getChatByUserId(userId: number): Promise<Chat> {
    return this.createQueryBuilder(Chat_.TN)
      .select([`${Chat_.TN}.${Chat_.ID}`, `${Chat_.TN}.${Chat_.CREATED_AT}`])
      .leftJoin(
        `${Chat_.TN}.${Chat_.RL_CHAT_PARTICIPANTS}`,
        ChatParticipant_.TN,
      )
      .where(`${ChatParticipant_.TN}.${ChatParticipant_.USER_ID} = :userId`)
      .setParameters({ userId })
      .getOne();
  }

  public async createChat(params: { name: string }): Promise<Chat> {
    const chat = this.create({ name: params.name });

    return this.save(chat);
  }
}
