import { EntityRepository, Repository } from 'typeorm';
import { Chat, Chat_ } from '../../model/entity/chat.entity';
import { ChatMessage_ } from '../../model/entity/chat-message.entity';
import { ChatParticipant_ } from '../../model/entity/chat-participant.entity';
import { User_ } from '../../model/entity/user.entity';
import { ChatEntryView } from '../../model/entity/view/chat-entry.view';

@EntityRepository(Chat)
export class ChatRepository extends Repository<Chat> {
  public async getChats(params: {
    userId: number;
    page: number;
    pageSize: number;
  }): Promise<ChatEntryView[]> {
    const rawData = await this.query(
      `
      SELECT
        "${Chat_.TN}"."${Chat_.ID}"                            AS "${Chat_.TN}_${Chat_.ID}",
        "${Chat_.TN}"."${Chat_.CREATED_AT}"                    AS "${Chat_.TN}_${Chat_.CREATED_AT}",
        "${Chat_.TN}"."${Chat_.NAME}"                          AS "${Chat_.TN}_${Chat_.NAME}",
        "${User_.TN}"."${User_.ID}"                            AS "${User_.TN}_${User_.ID}",
        "${User_.TN}"."${User_.FIRST_NAME}"                    AS "${User_.TN}_${User_.FIRST_NAME}",
        "${User_.TN}"."${User_.LAST_NAME}"                     AS "${User_.TN}_${User_.LAST_NAME}",
        "${User_.TN}"."${User_.PROFILE_IMAGE_PATH}"            AS "${User_.TN}_${User_.PROFILE_IMAGE_PATH}",
        "${ChatMessage_.TN}"."${ChatMessage_.ID}"              AS "${ChatMessage_.TN}_${ChatMessage_.ID}",
        "${ChatMessage_.TN}"."${ChatMessage_.CREATED_AT}"      AS "${ChatMessage_.TN}_${ChatMessage_.CREATED_AT}",
        "${ChatMessage_.TN}"."${ChatMessage_.MESSAGE_TYPE}"    AS "${ChatMessage_.TN}_${ChatMessage_.MESSAGE_TYPE}",
        "${ChatMessage_.TN}"."${ChatMessage_.TEXT_MESSAGE}"    AS "${ChatMessage_.TN}_${ChatMessage_.TEXT_MESSAGE}",
        "${ChatMessage_.TN}"."${ChatMessage_.IMAGE_FILE_PATH}" AS "${ChatMessage_.TN}_${ChatMessage_.IMAGE_FILE_PATH}",
        "${ChatMessage_.TN}"."${ChatMessage_.VOICE_FILE_PATH}" AS "${ChatMessage_.TN}_${ChatMessage_.VOICE_FILE_PATH}",
        "${ChatMessage_.TN}"."${ChatMessage_.VIDEO_FILE_PATH}" AS "${ChatMessage_.TN}_${ChatMessage_.VIDEO_FILE_PATH}"
      FROM "${Chat_.TN}"
      LEFT JOIN (
        SELECT
          "${ChatMessage_.TN}"."${ChatMessage_.ID}",
          "${ChatMessage_.TN}"."${ChatMessage_.CHAT_ID}",
          "${ChatMessage_.TN}"."${ChatMessage_.CREATED_AT}",
          "${ChatMessage_.TN}"."${ChatMessage_.MESSAGE_TYPE}",
          "${ChatMessage_.TN}"."${ChatMessage_.TEXT_MESSAGE}",
          "${ChatMessage_.TN}"."${ChatMessage_.IMAGE_FILE_PATH}",
          "${ChatMessage_.TN}"."${ChatMessage_.VOICE_FILE_PATH}",
          "${ChatMessage_.TN}"."${ChatMessage_.VIDEO_FILE_PATH}"
        FROM "${ChatMessage_.TN}"
        WHERE "${ChatMessage_.TN}"."${ChatMessage_.DELETED_AT}" IS NULL
        ORDER BY "${ChatMessage_.TN}"."${ChatMessage_.ID}" DESC
        LIMIT 1
      ) "${ChatMessage_.TN}"
        ON "${ChatMessage_.TN}"."${ChatMessage_.CHAT_ID}" = "${Chat_.TN}"."${Chat_.ID}"
      LEFT JOIN "${ChatParticipant_.TN}"
        ON "${ChatParticipant_.TN}"."${ChatParticipant_.CHAT_ID}" = "${Chat_.TN}"."${Chat_.ID}"
        AND "${ChatParticipant_.TN}"."${ChatParticipant_.DELETED_AT}" IS NULL
      LEFT JOIN "${User_.TN}"
        ON "${User_.TN}"."${User_.ID}" = "${ChatParticipant_.TN}"."${ChatParticipant_.USER_ID}"
        AND "${User_.TN}"."${User_.DELETED_AT}" IS NULL
      WHERE
        "${Chat_.TN}"."${Chat_.ID}" IN (
          SELECT "${ChatParticipant_.TN}"."${ChatParticipant_.CHAT_ID}"
            FROM "${ChatParticipant_.TN}"
            WHERE
              "${ChatParticipant_.TN}"."${ChatParticipant_.USER_ID}" = $1
              AND "${ChatParticipant_.TN}"."${ChatParticipant_.DELETED_AT}" IS NULL
        )
        AND "${ChatParticipant_.TN}"."${ChatParticipant_.USER_ID}" != $2
        AND "${Chat_.TN}"."${Chat_.DELETED_AT}" IS NULL
      ORDER BY "${Chat_.TN}_${Chat_.ID}" DESC
      OFFSET $3
      LIMIT $4
    `,
      [
        params.userId,
        params.userId,
        params.page * params.pageSize,
        params.pageSize,
      ],
    );

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
